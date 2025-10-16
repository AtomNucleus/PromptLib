
import Foundation

class GeminiService {
    private let apiKey: String? = ProcessInfo.processInfo.environment["API_KEY"]
    private let model = "gemini-2.5-pro"

    private func extractVariables(from text: String) -> [String] {
        do {
            let regex = try NSRegularExpression(pattern: "\\{\\(.*?\\)\\"", options: [])
            let results = regex.matches(in: text, options: [], range: NSRange(text.startIndex..., in: text))
            let variables = results.map { result -> String in
                let range = Range(result.range(at: 1), in: text)!
                return String(text[range])
            }
            return Array(Set(variables))
        } catch {
            print("Error extracting variables: \(error)")
            return []
        }
    }

    private func extractJson(from text: String) -> Any? {
        do {
            let regex = try NSRegularExpression(pattern: "```json\\n([\\s\\S]*?)\\n```", options: [])
            let match = regex.firstMatch(in: text, options: [], range: NSRange(text.startIndex..., in: text))
            let jsonString: String
            if let match = match, let range = Range(match.range(at: 1), in: text) {
                jsonString = String(text[range])
            } else {
                jsonString = text
            }
            let data = Data(jsonString.trimmingCharacters(in: .whitespacesAndNewlines).utf8)
            return try JSONSerialization.jsonObject(with: data, options: [])
        } catch {
            print("Failed to parse JSON from Gemini response: \(error)")
            return nil
        }
    }
    
    func composePromptsFromIdea(idea: String) async throws -> [Prompt] {
        guard let apiKey = apiKey else {
            print("Gemini API key not found. Returning mock data.")
            return [
                Prompt(id: UUID(), title: "Mock: Social Media Post", body: "Create a social media post about \(idea) for {{platform}}.", variables: ["platform"], tags: ["mock", "social-media"], createdAt: Date(), updatedAt: Date()),
                Prompt(id: UUID(), title: "Mock: Blog Post Idea", body: "Write a blog post outline about the benefits of \(idea). Target audience is {{audience}}.", variables: ["audience"], tags: ["mock", "blogging"], createdAt: Date(), updatedAt: Date())
            ]
        }
        // ... Network request implementation ...
        throw NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey : "Not implemented"])
    }

    func distillBookmarkFromUrl(url: URL) async throws -> (summary: String, prompts: [GeneratedPrompt], tags: [String]) {
        guard let apiKey = apiKey else {
            print("Gemini API key not found. Returning mock data.")
            return (
                summary: "This is a mock summary of the URL. The Gemini API key is not configured.",
                prompts: [
                    GeneratedPrompt(title: "Mock: Explain this to a 5-year-old", body: "Explain the main concept of the page at the provided URL to a 5-year-old.", variables: [], tags: ["mock", "explain"]),
                    GeneratedPrompt(title: "Mock: Create a tweet thread", body: "Summarize the key takeaways from the URL in a 3-part tweet thread.", variables: [], tags: ["mock", "social-media"])
                ],
                tags: ["mock", "distilled"]
            )
        }
        // ... Network request implementation ...
        throw NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey : "Not implemented"])
    }

    func refinePromptBody(prompt: Prompt, framework: String) async throws -> String {
        guard let apiKey = apiKey else {
            print("Gemini API key not found. Returning mock data.")
            return "\(prompt.body)\n\n---\n*Mock Refinement Applied: \(framework)*"
        }
        // ... Network request implementation ...
        throw NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey : "Not implemented"])
    }

    func generateVariableSuggestions(promptBody: String, variableName: String) async throws -> [String] {
        guard let apiKey = apiKey else {
            print("Gemini API key not found. Returning mock data.")
            return [
                "Mock suggestion 1 for \(variableName)",
                "Mock suggestion 2 for \(variableName)",
                "Mock suggestion 3 for \(variableName)",
            ]
        }
        // ... Network request implementation ...
        throw NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey : "Not implemented"])
    }
}
