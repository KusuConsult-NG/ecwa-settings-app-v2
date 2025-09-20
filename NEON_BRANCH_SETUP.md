# Neon Database Branch Management Setup

This workflow automatically creates and manages Neon database branches for each pull request, providing isolated database environments for testing and development.

## 🚀 Features

- **Automatic Branch Creation**: Creates a new Neon branch for each PR
- **Automatic Cleanup**: Deletes the branch when PR is closed
- **14-Day Expiration**: Branches automatically expire after 2 weeks
- **Isolated Testing**: Each PR gets its own database environment
- **Schema Diff Support**: Optional schema comparison between branches

## 📋 Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Neon Project**: Create a project in your Neon dashboard
3. **API Key**: Generate an API key from your Neon dashboard

## ⚙️ Setup Instructions

### 1. Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
- `NEON_API_KEY`: Your Neon API key from the dashboard

### 2. Configure GitHub Variables

Go to your repository → Settings → Secrets and variables → Actions → Variables tab

Add these variables:
- `NEON_PROJECT_ID`: Your Neon project ID (found in project settings)

### 3. Repository Permissions

The workflow needs these permissions to work properly:

```yaml
permissions:
  contents: read
  pull-requests: write
```

Add this to your workflow file if you want to enable schema diff comments.

## 🔧 How It Works

### Branch Creation
- **Trigger**: When a PR is opened, reopened, or synchronized
- **Branch Name**: `preview/pr-{PR_NUMBER}-{BRANCH_NAME}`
- **Expiration**: 14 days from creation
- **Database URL**: Available as `${{ steps.create_neon_branch.outputs.db_url_with_pooler }}`

### Branch Deletion
- **Trigger**: When a PR is closed
- **Action**: Automatically deletes the corresponding Neon branch

## 🛠️ Usage Examples

### Basic Usage
The workflow runs automatically when you create or update a PR. No additional setup needed!

### With Database Migrations
Uncomment the migration step in the workflow:

```yaml
- name: Run Migrations
  run: npm run db:migrate
  env:
    DATABASE_URL: "${{ steps.create_neon_branch.outputs.db_url_with_pooler }}"
```

### With Schema Diff Comments
Uncomment the schema diff step to get automatic schema comparison comments on your PRs:

```yaml
- name: Post Schema Diff Comment to PR
  uses: neondatabase/schema-diff-action@v1
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    compare_branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

## 🔍 Monitoring

### Check Workflow Status
1. Go to your repository → Actions tab
2. Look for "Create/Delete Branch for Pull Request" workflow
3. Check the status of each job

### View Database Branches
1. Go to your Neon dashboard
2. Navigate to your project
3. Check the "Branches" section to see all created branches

## 🚨 Troubleshooting

### Common Issues

**Workflow fails to create branch:**
- Check that `NEON_API_KEY` secret is correctly set
- Verify `NEON_PROJECT_ID` variable is correct
- Ensure your Neon account has sufficient credits

**Branch not deleted:**
- Check that the PR was actually closed (not just merged)
- Verify the API key has delete permissions
- Check Neon dashboard for any remaining branches

**Database connection issues:**
- Use the pooled connection URL: `db_url_with_pooler`
- Check that your application can connect to the new database
- Verify environment variables are properly set

### Debug Steps

1. **Check Workflow Logs**: Look at the Actions tab for detailed error messages
2. **Verify Secrets**: Ensure all secrets and variables are correctly configured
3. **Test API Key**: Use the Neon CLI to test your API key
4. **Check Permissions**: Ensure the workflow has necessary permissions

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Neon Branch Management](https://neon.tech/docs/guides/branching)
- [Schema Diff Action](https://github.com/neondatabase/schema-diff-action)

## 🔄 Workflow Customization

### Change Branch Expiration
Modify the expiration date in the workflow:

```yaml
run: echo "EXPIRES_AT=$(date -u --date '+7 days' +'%Y-%m-%dT%H:%M:%SZ')" >> "$GITHUB_ENV"
```

### Add Custom Steps
Add your own steps after branch creation:

```yaml
- name: Run Tests
  run: npm test
  env:
    DATABASE_URL: "${{ steps.create_neon_branch.outputs.db_url_with_pooler }}"
```

### Environment-Specific Configuration
Use different settings for different environments:

```yaml
- name: Create Neon Branch
  uses: neondatabase/create-branch-action@v6
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: ${{ github.ref_name == 'main' && 'production' || 'preview' }}-pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
    expires_at: ${{ env.EXPIRES_AT }}
```

## ✅ Benefits

- **Isolated Testing**: Each PR gets its own database
- **No Data Conflicts**: Safe to test database changes
- **Automatic Cleanup**: No manual branch management needed
- **Cost Effective**: Branches expire automatically
- **Easy Debugging**: Clear separation between PR environments
- **Schema Tracking**: Optional schema change visibility

This setup ensures your ChurchFlow project has proper database isolation for all pull requests! 🎉
