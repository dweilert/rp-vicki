# 1 — Before you start

The things a person has to do in a browser, with a card and a phone. Everything
after this is one template and a few commands.

Budget about **90 minutes**, most of it waiting for verification emails. You do
not need to finish in one sitting.

You will need:

- An email address you control
- A credit or debit card (AWS requires one even though this site costs a few
  dollars a year)
- A phone that can receive a call or text
- A password manager, or somewhere genuinely safe to write two passwords

---

## 1.1 Create the AWS account

Go to <https://aws.amazon.com/> and choose **Create an AWS Account**.

Use the organization's email address if one exists. If it does not, a personal
address is fine to start — **an AWS account's root email can be changed later**,
so this is not a decision you are locked into. Put it on the list in
[05-runbook.md](05-runbook.md) to revisit.

Choose the **Basic (free)** support plan.

> **Why the account matters more than it looks.** Whoever controls this account
> controls the website. If it is registered to a person who later leaves the
> organization, getting it back is a support case with an uncertain outcome.
> Moving it to an organization address is a settings change; recovering it from
> someone unreachable is not.

## 1.2 Lock the root user — do this now, not later

The address you just signed up with is the **root user**. It can do anything,
including close the account and remove other people's access. It should be used
roughly once a year.

1. Sign in at <https://console.aws.amazon.com/>
2. Top right, click your account name → **Security credentials**
3. Under **Multi-factor authentication (MFA)**, click **Assign MFA device**
4. Choose **Authenticator app** and follow the prompts with Google
   Authenticator, Authy, 1Password, or your phone's built-in option
5. Save the recovery codes somewhere that is not the same phone

> **This is the single highest-value step in this document.** A root account
> without MFA, on an address that also receives ordinary email, is one
> successful phishing message away from losing the site.

## 1.3 Create a day-to-day admin user

Root is for emergencies. Daily work uses a separate user.

1. In the console search bar, type **IAM** and open it
2. **Users** → **Create user**
3. Name it something like `vicki-admin`
4. Tick **Provide user access to the AWS Management Console**
5. Choose **I want to create an IAM user**, set a strong password
6. Next → **Attach policies directly** → tick **AdministratorAccess**
7. Create the user, then **download the sign-in URL** — it looks like
   `https://123456789012.signin.aws.amazon.com/console`. That is how you sign
   in from now on
8. Sign in as that user and turn on MFA for it too (same steps as 1.2)

Then sign out of root and leave it alone.

## 1.4 Create access keys for the command line

Some steps use commands rather than clicks. This is how your computer proves
who it is.

1. IAM → **Users** → your admin user → **Security credentials**
2. **Create access key** → choose **Command Line Interface (CLI)**
3. Tick the acknowledgement, then create
4. Copy both values now — **the secret is shown once and never again**

Install the AWS CLI: <https://aws.amazon.com/cli/> (there is a normal Windows
installer). Then open Command Prompt or PowerShell and run:

```bash
aws configure
```

Paste the access key ID, the secret, `us-east-2` for the region, and `json` for
the output format.

Check it worked:

```bash
aws sts get-caller-identity
```

You should see your account number and your user name. If you see an error
about credentials, run `aws configure` again — something was mistyped.

> **Treat the secret key like a house key.** It is not protected by your
> password or MFA: anyone holding it has your access. Never paste it into a
> repository, a document, a chat message, or a support ticket. If it is ever
> exposed, delete it in IAM immediately and create a new one — that takes two
> minutes and instantly makes the old one useless.

## 1.5 Pick a region and stay in it

A region is which part of the world your site is served from. **`us-east-2`**
(Ohio) is a reasonable default for a Texas organization.

The specific choice barely matters. Consistency does — resources in different
regions cannot see each other, and the console silently shows you an empty list
rather than warning you that you are in the wrong one. **If something you
created has vanished, check the region selector in the top right before
anything else.** It is the most common source of confusion in AWS, by a wide
margin.

## 1.6 Domain name

Skip this section if the site is launching on its free `amplifyapp.com`
address for now. You can add a domain later without rebuilding anything.

**If the organization already owns a domain elsewhere** (GoDaddy, Namecheap,
Google Domains), you have two options. Transferring it into Route 53 is
tidiest. Pointing the existing registrar at Route 53's nameservers also works.
Either way you need a hosted zone, below.

**To register a new domain in AWS:** console search → **Route 53** →
**Registered domains** → **Register domains**. Roughly $13–15 a year for a
`.com` or `.org`. Registering here creates the hosted zone automatically, which
is why it is the easiest path.

For this site the domain is **`austinareafirewise.org`**. It matches the
organization's name and wordmark, which helps people confirm the site is
genuinely the Alliance's, and "Area" signals the countywide scope rather than
just the city.

Consider registering **`austinfirewise.org`** at the same time and pointing it
here. It is the shorter form people will guess or misremember, and about $14 a
year stops someone else holding it.

> **Register it in the organization's AWS account**, not on a personal
> registrar account. Same reasoning as 1.1, and domains are harder to move than
> accounts.

**To create a hosted zone for a domain you already own:** Route 53 → **Hosted
zones** → **Create hosted zone** → enter the domain → **Public hosted zone**.
Then copy the four nameserver (NS) values it shows you and enter them at your
current registrar, replacing what is there.

Confirm the hosted zone exists before you go on:

```bash
aws route53 list-hosted-zones --query "HostedZones[].Name" --output text
```

Your domain should be in that list, with a trailing dot. If it is not, the
template in step 2 will fail when it tries to set up the certificate.

## 1.7 Create the GitHub organization and repository

GitHub holds the website's files and publishes them to AWS.

A GitHub **Organization** is free — the Free plan covers unlimited public and
private repositories and unlimited collaborators, and GitHub Actions, which is
what publishes the site. The paid tiers add enterprise features this site will
never need.

Use an organization rather than a personal account for one reason that matters
more than any feature: **an organization can have two owners, and a personal
account cannot have any.** If the single owner of a personal account is
unreachable — ill, travelling, or no longer involved — nobody can add a
collaborator, transfer the repository, or recover access. It needs their
password and their phone.

1. Create a personal GitHub account first if you do not have one, at
   <https://github.com/>. Every organization is administered through a personal
   account; there is no way to skip this step
2. Turn on two-factor authentication on it: avatar → **Settings** → **Password
   and authentication** → **Enable two-factor authentication**. Save the
   recovery codes somewhere other than the phone running the authenticator
3. Then avatar → **Settings** → **Organizations** → **New organization** →
   choose the **Free** plan
4. Name it `austinfirewise`, with `vicki@vickilandon.com` as the contact email
5. **Add a second owner now, while you are thinking about it.** Organization
   **Settings** → **People** → invite them → change their role to **Owner**.
   An organization with one owner has the same weakness as a personal account,
   it just hides it better

Then create the repository: organization page → **New repository**, named
`aafa-site`, owned by the organization rather than by you.

Public or private both work. Public means anyone can read the site's source —
usually fine, and it lets others learn from your setup — but note that your AWS
account number and the deploy role's name become visible. Neither grants any
access on its own, and the role only trusts your repository. If that still
feels uncomfortable, choose private; nothing else changes, and Actions minutes
are free either way at this volume.

> **If you already started on a personal account,** nothing is lost. GitHub
> converts a personal account into an organization without losing repositories,
> history, or issues: **Settings** → **Organizations** → **Turn <account> into
> an organization**. Do it before other people depend on the account, not after.

## 1.8 Check whether the GitHub identity provider already exists

Only relevant if this AWS account has hosted a site before. A fresh account has
none, and you can skip to step 2.

```bash
aws iam list-open-id-connect-providers
```

- **Empty result** → answer **yes** to `CreateGitHubOIDCProvider` in step 2
- **A result containing `token.actions.githubusercontent.com`** → answer **no**

Getting this wrong is not damaging. The stack simply fails with a message about
the provider already existing, and you re-run it with the other answer.

---

## Before moving on

- [ ] Root user has MFA, and its password is stored somewhere safe
- [ ] Admin user created, with MFA, and you can sign in as it
- [ ] `aws sts get-caller-identity` returns your account number
- [ ] You know which region you are using and it is the same everywhere
- [ ] Hosted zone exists, if you are using a custom domain
- [ ] GitHub organization exists with two owners, and holds an empty repository

Next: [02-deploy-stack.md](02-deploy-stack.md)
