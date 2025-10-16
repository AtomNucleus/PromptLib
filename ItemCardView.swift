
import SwiftUI

struct ItemCardView: View {
    let item: any Item
    let onSelect: () -> Void
    let onTagClick: (String) -> Void

    private func borderColor(for kind: ItemKind) -> Color {
        switch kind {
        case .prompt: return .green
        case .bookmark: return .purple
        case .note: return .orange
        }
    }

    private func icon(for kind: ItemKind) -> Image {
        switch kind {
        case .prompt: return Image(systemName: "text.quote")
        case .note: return Image(systemName: "note.text")
        case .bookmark: return Image(systemName: "bookmark")
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top) {
                Text(item.title)
                    .font(.headline)
                    .foregroundColor(.white)
                Spacer()
                icon(for: item.kind)
                    .foregroundColor(.secondary)
            }

            Group {
                if let prompt = item as? Prompt {
                    Text(prompt.body)
                        .lineLimit(3)
                } else if let note = item as? Note {
                    Text(note.body ?? "")
                        .lineLimit(3)
                } else if let bookmark = item as? Bookmark {
                    HStack {
                        Image(systemName: "link")
                        Text(bookmark.url.absoluteString)
                    }
                    .foregroundColor(.accentColor)
                    .lineLimit(1)
                }
            }
            .font(.subheadline)
            .foregroundColor(.secondary)

            VStack(alignment: .leading) {
                if let tags = item.tags, !tags.isEmpty {
                    HStack {
                        ForEach(tags.prefix(3), id: \.self) { tag in
                            TagView(label: tag, onClick: { onTagClick(tag) })
                        }
                    }
                }
                
                Text("Updated \(item.updatedAt, formatter: DateFormatter.shortDate)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(borderColor(for: item.kind), lineWidth: 1)
        )
        .onTapGesture {
            onSelect()
        }
    }
}

struct TagView: View {
    let label: String
    let onClick: () -> Void

    var body: some View {
        Button(action: onClick) {
            Text(label)
                .font(.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.accentColor.opacity(0.2))
                .foregroundColor(.accentColor)
                .cornerRadius(8)
        }
    }
}

extension DateFormatter {
    static let shortDate: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter
    }()
}
