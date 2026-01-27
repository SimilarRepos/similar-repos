import { getPrompt } from '@/utils/storage'

export const promptTemplates: Record<string, string> = {
  recommendRepos: `# Role
You are an expert Open Source Developer and GitHub ecosystem specialist. You have a deep understanding of various technology stacks, libraries, and tools.

# Task
Based on the "Target Repository Information" provided below, recommend exactly {repoCount} GitHub repositories that are most relevant.
Relevance can be defined as:
1. Solving a similar problem (Alternatives).
2. Being a complementary tool (part of the same ecosystem).
3. Using a similar architectural pattern or tech stack for a similar domain.

# Target Repository Information
- **Repo Name:** {repoId}

# Excluded Repositories
The following repositories have already been recommended and should not be included in your recommendations:
{excludeRepos}

`,
}

export async function buildPrompt(
  scenario: string,
  params: Record<string, any>,
): Promise<string> {
  let promptTemp = await getPrompt()
  if (!promptTemp) {
    const template = promptTemplates[scenario]
    if (!template) {
      throw new Error(`Unknown scenario: ${scenario}`)
    }
    promptTemp = template
  }

  return JSON.stringify(
    Object.entries(params).reduce((prompt, [key, value]) => {
      // Handle array parameters by converting to a formatted string
      let replacementValue = value
      if (Array.isArray(value)) {
        if (value.length === 0) {
          replacementValue = '(None - all repositories are eligible)'
        }
        else {
          replacementValue = value.map(id => `- ${id}`).join('\n')
        }
      }
      return prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), replacementValue)
    }, promptTemp),
  )
}
