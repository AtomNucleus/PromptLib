
import Foundation
import Combine

enum SortOption: String, CaseIterable {
    case recent = "Recent"
    case alphabetical = "Alphabetical"
}

@MainActor
class AppViewModel: ObservableObject {
    @Published var items: [any Item] = Constants.initialItems
    @Published var searchTerm: String = ""
    @Published var activeTags: Set<String> = []
    @Published var activeKind: ItemKind? = nil
    @Published var sortBy: SortOption = .recent

    @Published var isQuickAddOpen: Bool = false
    @Published var isFiltersOpen: Bool = false
    @Published var selectedItem: (any Item)? = nil
    @Published var isLoading: Bool = false
    @Published var error: String? = nil

    private let geminiService = GeminiService()
    private var cancellables = Set<AnyCancellable>()

    var allTags: [String] {
        let tags = Set(items.flatMap { $0.tags ?? [] })
        return Array(tags).sorted()
    }

    var filteredItems: [any Item] {
        var filtered = items

        if !searchTerm.isEmpty {
            filtered = filtered.filter { item in
                item.title.localizedCaseInsensitiveContains(searchTerm) ||
                (item.body ?? "").localizedCaseInsensitiveContains(searchTerm)
            }
        }

        if !activeTags.isEmpty {
            filtered = filtered.filter { item in
                let itemTags = Set(item.tags ?? [])
                return !activeTags.isDisjoint(with: itemTags)
            }
        }

        if let activeKind = activeKind {
            filtered = filtered.filter { $0.kind == activeKind }
        }

        switch sortBy {
        case .alphabetical:
            filtered.sort { $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending }
        case .recent:
            filtered.sort { $0.updatedAt > $1.updatedAt }
        }

        return filtered
    }

    func toggleTag(_ tag: String) {
        if activeTags.contains(tag) {
            activeTags.remove(tag)
        } else {
            activeTags.insert(tag)
        }
    }

    func clearFilters() {
        activeTags.removeAll()
    }

    func handleQuickAdd(idea: String) {
        isLoading = true
        error = nil
        Task {
            do {
                let newPrompts = try await geminiService.composePromptsFromIdea(idea: idea)
                self.items.insert(contentsOf: newPrompts, at: 0)
                self.isQuickAddOpen = false
            } catch {
                self.error = error.localizedDescription
            }
            isLoading = false
        }
    }

    func handleDistillBookmark(item: Bookmark) {
        isLoading = true
        error = nil
        Task {
            do {
                let (summary, prompts, tags) = try await geminiService.distillBookmarkFromUrl(url: item.url)
                var updatedItem = item
                updatedItem.body = summary
                updatedItem.tags = Array(Set((item.tags ?? []) + tags))
                
                if let index = self.items.firstIndex(where: { $0.id == item.id }) {
                    self.items[index] = updatedItem
                }
                
                let newPrompts = prompts.map { p in
                    Prompt(id: UUID(), title: p.title, body: p.body, variables: p.variables, tags: p.tags, createdAt: Date(), updatedAt: Date(), source: ["type": "bookmark-distill", "url": item.url.absoluteString])
                }
                self.items.insert(contentsOf: newPrompts, at: 0)
                self.selectedItem = nil
            } catch {
                self.error = error.localizedDescription
                self.selectedItem = nil
            }
            isLoading = false
        }
    }

    func handleRefinePrompt(prompt: Prompt, framework: String) {
        isLoading = true
        error = nil
        Task {
            do {
                let refinedBody = try await geminiService.refinePromptBody(prompt: prompt, framework: framework)
                if let index = self.items.firstIndex(where: { $0.id == prompt.id }) {
                    var updatedPrompt = prompt
                    updatedPrompt.body = refinedBody
                    updatedPrompt.updatedAt = Date()
                    self.items[index] = updatedPrompt
                    self.selectedItem = updatedPrompt
                }
            } catch {
                self.error = "Failed to refine prompt."
            }
            isLoading = false
        }
    }
    
    func handleUpdateItem(item: any Item) {
        if let index = items.firstIndex(where: { $0.id == item.id }) {
            var updatedItem = item
            updatedItem.updatedAt = Date()
            items[index] = updatedItem
        }
    }
}
