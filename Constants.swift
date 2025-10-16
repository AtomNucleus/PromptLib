
import Foundation

struct Constants {
    static let initialItems: [any Item] = [
        Prompt(
            id: UUID(),
            title: "Generate a blog post outline",
            body: "Create a detailed blog post outline for the topic \"{{topic}}\". The target audience is {{audience}}, and the desired tone is {{tone}}. The outline should include an introduction, 3-5 main sections with sub-bullets, and a conclusion.",
            variables: ["topic", "audience", "tone"],
            tags: ["writing", "blogging", "content-creation"],
            createdAt: Date(),
            updatedAt: Date(),
            model: "gemini-2.5-pro"
        ),
        Bookmark(
            id: UUID(),
            title: "Google AI for Developers",
            url: URL(string: "https://ai.google.dev/")!,
            tags: ["ai", "google", "docs", "gemini"],
            favicon: "https://www.google.com/s2/favicons?domain=ai.google.dev&sz=128",
            createdAt: Date(),
            updatedAt: Date()
        ),
        Note(
            id: UUID(),
            title: "Idea for new app feature",
            body: "What if we used the URL Context tool from the Gemini API to automatically summarize and categorize bookmarks? This could be a game-changer for knowledge management.",
            tags: ["ideas", "feature", "gemini-api"],
            createdAt: Date(),
            updatedAt: Date()
        ),
        Prompt(
            id: UUID(),
            title: "Dave Clark Cinematic Layout",
            body: "Generate a cinematic visual description using the Dave Clark method.\n\nSCENE:\n{{scene_description}}\n\nSHOT 1:\n- Camera Angle: \n- Lens: \n- Movement: \n- Subject: \n- Action:",
            variables: ["scene_description"],
            tags: ["creative", "writing", "film", "dave-clark"],
            createdAt: Date(),
            updatedAt: Date()
        )
    ]

    static let refinementFrameworks = [
        "Okay/Better/Best",
        "Dave Clark Cinematic",
        "Problem/Agitate/Solve (PAS)",
        "Feature/Advantage/Benefit (FAB)",
        "Add more specific details",
        "Make it more concise",
    ]
}
