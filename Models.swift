
import Foundation

enum ItemKind: String, Codable {
    case note
    case prompt
    case bookmark
}

protocol Item {
    var id: UUID { get }
    var kind: ItemKind { get }
    var title: String { get set }
    var body: String? { get set }
    var tags: [String]? { get set }
    var createdAt: Date { get }
    var updatedAt: Date { get set }
    var source: [String: Any]? { get set }
}

struct Note: Item, Codable, Identifiable {
    let id: UUID
    let kind: ItemKind = .note
    var title: String
    var body: String?
    var tags: [String]?
    let createdAt: Date
    var updatedAt: Date
    var source: [String: Any]?

    enum CodingKeys: String, CodingKey {
        case id, kind, title, body, tags, createdAt, updatedAt, source
    }
}

struct Bookmark: Item, Codable, Identifiable {
    let id: UUID
    let kind: ItemKind = .bookmark
    var title: String
    var body: String?
    var url: URL
    var favicon: String?
    var tags: [String]?
    let createdAt: Date
    var updatedAt: Date
    var source: [String: Any]?

    enum CodingKeys: String, CodingKey {
        case id, kind, title, body, url, favicon, tags, createdAt, updatedAt, source
    }
}

struct Prompt: Item, Codable, Identifiable {
    let id: UUID
    let kind: ItemKind = .prompt
    var title: String
    var body: String
    var variables: [String]?
    var model: String?
    var tags: [String]?
    let createdAt: Date
    var updatedAt: Date
    var source: [String: Any]?

    enum CodingKeys: String, CodingKey {
        case id, kind, title, body, variables, model, tags, createdAt, updatedAt, source
    }
}

struct GeneratedPrompt: Codable {
    var title: String
    var body: String
    var variables: [String]
    var tags: [String]
}
