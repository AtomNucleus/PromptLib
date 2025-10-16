
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = AppViewModel()

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                
                VStack(alignment: .leading, spacing: 0) {
                    HeaderView(onQuickAdd: { viewModel.isQuickAddOpen = true })
                    
                    SearchBarView(
                        searchTerm: $viewModel.searchTerm,
                        activeKind: $viewModel.activeKind,
                        activeFilterCount: viewModel.activeTags.count,
                        onFiltersClick: { viewModel.isFiltersOpen = true },
                        sortBy: $viewModel.sortBy,
                        itemCount: viewModel.filteredItems.count
                    )
                    .padding(.horizontal)
                    
                    if let error = viewModel.error {
                        ErrorView(error: error)
                            .padding()
                    }
                    
                    ItemListView(items: viewModel.filteredItems, onSelectItem: { viewModel.selectedItem = $0 }, onTagClick: { viewModel.toggleTag($0) })
                }
                
                if viewModel.isLoading {
                    LoadingView()
                }
            }
            .navigationBarHidden(true)
        }
        .sheet(isPresented: $viewModel.isQuickAddOpen) {
            QuickAddModal(onSubmit: { viewModel.handleQuickAdd(idea: $0) })
        }
        .sheet(isPresented: $viewModel.isFiltersOpen) {
            FiltersModal(
                allTags: viewModel.allTags,
                activeTags: $viewModel.activeTags,
                toggleTag: { viewModel.toggleTag($0) },
                clearFilters: { viewModel.clearFilters() }
            )
        }
        .sheet(item: $viewModel.selectedItem) { item in
            if let prompt = item as? Prompt {
                PromptDetailModal(
                    prompt: prompt,
                    onUpdate: { viewModel.handleUpdateItem(item: $0) },
                    onRefine: { viewModel.handleRefinePrompt(prompt: $0, framework: $1) },
                    refinementFrameworks: Constants.refinementFrameworks,
                    isLoading: viewModel.isLoading
                )
            } else if let bookmark = item as? Bookmark {
                BookmarkDetailModal(
                    bookmark: bookmark,
                    onDistill: { viewModel.handleDistillBookmark(item: $0) },
                    isLoading: viewModel.isLoading
                )
            }
        }
    }
}

// Placeholder Views

struct HeaderView: View {
    var onQuickAdd: () -> Void
    var body: some View {
        HStack {
            LogoIcon()
                .frame(width: 32, height: 32)
            Text("Prompt Architect")
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Spacer()
            
            Button(action: onQuickAdd) {
                HStack {
                    Image(systemName: "sparkles")
                    Text("Quick Add")
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.accentColor)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Material.ultraThinMaterial)
        .overlay(Divider(), alignment: .bottom)
    }
}

struct LogoIcon: View {
    var body: some View {
        Image(systemName: "square.grid.2x2.fill")
            .foregroundColor(.accentColor)
    }
}

struct SearchBarView: View {
    @Binding var searchTerm: String
    @Binding var activeKind: ItemKind?
    var activeFilterCount: Int
    var onFiltersClick: () -> Void
    @Binding var sortBy: SortOption
    var itemCount: Int
    
    var body: some View {
        VStack {
            HStack {
                TextField("Search...", text: $searchTerm)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: onFiltersClick) {
                    HStack {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                        if activeFilterCount > 0 {
                            Text("\(activeFilterCount)").font(.caption)
                        }
                    }
                }
            }
            
            HStack {
                Picker("Kind", selection: $activeKind) {
                    Text("All").tag(ItemKind?.none)
                    Text("Notes").tag(ItemKind?.some(.note))
                    Text("Prompts").tag(ItemKind?.some(.prompt))
                    Text("Bookmarks").tag(ItemKind?.some(.bookmark))
                }
                .pickerStyle(SegmentedPickerStyle())
                
                Spacer()
                
                Picker("Sort by", selection: $sortBy) {
                    ForEach(SortOption.allCases, id: \.self) {
                        Text($0.rawValue)
                    }
                }
                .pickerStyle(MenuPickerStyle())
            }
            
            HStack {
                Text("\(itemCount) items")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Spacer()
            }
        }
        .padding(.bottom)
    }
}

struct ItemListView: View {
    let items: [any Item]
    let onSelectItem: (any Item) -> Void
    let onTagClick: (String) -> Void

    var body: some View {
        ScrollView {
            if items.isEmpty {
                VStack {
                    Text("No Items Found")
                        .font(.title)
                    Text("Try adjusting your search or filters.")
                        .foregroundColor(.secondary)
                }
                .padding()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 300))], spacing: 16) {
                    ForEach(items, id: \.id) { item in
                        ItemCardView(item: item, onSelect: { onSelectItem(item) }, onTagClick: onTagClick)
                    }
                }
                .padding()
            }
        }
    }
}

struct ErrorView: View {
    var error: String
    var body: some View {
        Text(error)
            .foregroundColor(.red)
            .padding()
            .background(Color.red.opacity(0.2))
            .cornerRadius(8)
    }
}

struct LoadingView: View {
    var body: some View {
        ZStack {
            Color.black.opacity(0.8).ignoresSafeArea()
            VStack {
                ProgressView()
                Text("Gemini is thinking...")
                    .foregroundColor(.white)
                    .padding(.top, 8)
            }
        }
    }
}

struct QuickAddModal: View {
    var onSubmit: (String) -> Void
    @State private var idea: String = ""
    @Environment(\.dismiss) var dismiss
    var isLoading: Bool = false

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Your Idea or Goal"), footer: Text("Describe what you want to achieve, and Gemini will generate 5 ready-to-use prompts for you.")) {
                    TextEditor(text: $idea)
                        .frame(minHeight: 150)
                }
            }
            .navigationTitle("Quick Add & Compose")
            .navigationBarItems(leading: Button("Cancel") { dismiss() },
                                trailing: Button(action: {
                                    onSubmit(idea)
                                }) {
                                    if isLoading {
                                        ProgressView()
                                    } else {
                                        Text("Make Prompts")
                                    }
                                }.disabled(idea.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isLoading))
        }
    }
}

struct FiltersModal: View {
    var allTags: [String]
    @Binding var activeTags: Set<String>
    var toggleTag: (String) -> Void
    var clearFilters: () -> Void
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Filter by Tag")) {
                    if allTags.isEmpty {
                        Text("No tags available to filter by.")
                            .foregroundColor(.secondary)
                    } else {
                        ForEach(allTags, id: \.self) { tag in
                            Button(action: { toggleTag(tag) }) {
                                HStack {
                                    Text(tag)
                                    Spacer()
                                    if activeTags.contains(tag) {
                                        Image(systemName: "checkmark")
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarItems(
                leading: Button("Clear") {
                    clearFilters()
                }.disabled(activeTags.isEmpty),
                trailing: Button("Done") {
                    dismiss()
                }
            )
        }
    }
}

struct PromptDetailModal: View {
    @State var prompt: Prompt
    var onUpdate: (Prompt) -> Void
    var onRefine: (Prompt, String) -> Void
    var refinementFrameworks: [String]
    var isLoading: Bool
    @Environment(\.dismiss) var dismiss
    @State private var selectedFramework: String

    init(prompt: Prompt, onUpdate: @escaping (Prompt) -> Void, onRefine: @escaping (Prompt, String) -> Void, refinementFrameworks: [String], isLoading: Bool) {
        self._prompt = State(initialValue: prompt)
        self.onUpdate = onUpdate
        self.onRefine = onRefine
        self.refinementFrameworks = refinementFrameworks
        self.isLoading = isLoading
        self._selectedFramework = State(initialValue: refinementFrameworks.first ?? "")
    }

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Prompt Body")) {
                    TextEditor(text: $prompt.body)
                        .frame(minHeight: 200)
                        .font(.system(.body, design: .monospaced))
                }

                if let variables = prompt.variables, !variables.isEmpty {
                    Section(header: Text("Variables")) {
                        ForEach(variables, id: \.self) { variable in
                            VariableInputView(name: variable, promptBody: prompt.body)
                        }
                    }
                }

                Section(header: Text("AI Refinement")) {
                    Picker("Framework", selection: $selectedFramework) {
                        ForEach(refinementFrameworks, id: \.self) {
                            Text($0)
                        }
                    }
                    Button(action: { onRefine(prompt, selectedFramework) }) {
                        HStack {
                            if isLoading {
                                ProgressView()
                            } else {
                                Image(systemName: "sparkles")
                            }
                            Text("Refine")
                        }
                    }.disabled(isLoading)
                }
            }
            .navigationTitle(prompt.title)
            .navigationBarItems(trailing: Button("Save & Close") {
                onUpdate(prompt)
                dismiss()
            })
        }
    }
}

struct VariableInputView: View {
    let name: String
    let promptBody: String
    @State private var value: String = ""
    @State private var suggestions: [String] = []
    @State private var isLoading: Bool = false
    @State private var error: String? = nil
    private let geminiService = GeminiService()

    var body: some View {
        VStack(alignment: .leading) {
            Text("{{ \(name) }}")
                .font(.caption)
                .foregroundColor(.secondary)
            HStack {
                TextField("Enter value for \(name)...", text: $value)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: {
                    Task {
                        isLoading = true
                        error = nil
                        do {
                            suggestions = try await geminiService.generateVariableSuggestions(promptBody: promptBody, variableName: name)
                        } catch {
                            self.error = error.localizedDescription
                        }
                        isLoading = false
                    }
                }) {
                    if isLoading {
                        ProgressView()
                    } else {
                        Image(systemName: "sparkles")
                    }
                }
            }
            if !suggestions.isEmpty {
                Menu {
                    ForEach(suggestions, id: \.self) { suggestion in
                        Button(suggestion) {
                            self.value = suggestion
                        }
                    }
                } label: {
                    Text("Suggestions")
                }
            }
            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}

struct BookmarkDetailModal: View {
    let bookmark: Bookmark
    let onDistill: (Bookmark) -> Void
    let isLoading: Bool
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            Form {
                Section {
                    Link(destination: bookmark.url) {
                        HStack {
                            if let favicon = bookmark.favicon, let url = URL(string: favicon) {
                                AsyncImage(url: url) {
                                    $0.resizable()
                                }.frame(width: 24, height: 24)
                            }
                            Text(bookmark.url.absoluteString)
                        }
                    }
                }

                if let summary = bookmark.body, !summary.isEmpty {
                    Section(header: Text("AI Summary")) {
                        Text(summary)
                    }
                }
                
                Section(footer: Text("\"Distill\" uses Gemini with Google Search to read the webpage, generate a summary, and create new prompts based on its content.")) {
                    Button(action: { onDistill(bookmark) }) {
                        HStack {
                            if isLoading {
                                ProgressView()
                            } else {
                                Image(systemName: "sparkles")
                            }
                            Text("Distill & Create Prompts")
                        }
                    }.disabled(isLoading)
                }
            }
            .navigationTitle(bookmark.title)
            .navigationBarItems(trailing: Button("Done") { dismiss() })
        }
    }
}
