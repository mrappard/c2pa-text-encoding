# GEMINI

## Overview
GEMINI is a document interaction tool that allows users to browse, read, extract, and recompose text from a collection of papers. The system emphasizes seamless navigation, text reuse, and automatic source attribution.

---

## Core Concept
Users can:
1. Browse a collection of papers
2. Search and filter papers
3. Read full paper content
4. Copy selected text
5. Paste text into a new document workspace
6. Automatically generate sources for pasted content

---

## User Interface Layout

### Left Panel (Navigation)
- Displays a list of available papers
- Includes a search bar for filtering papers by:
  - Title
  - Keywords
  - Metadata (optional)
- Scrollable list
- Click interaction loads selected paper

### Main Panel (Content Viewer)
- Displays full text of the selected paper
- Supports:
  - Text selection
  - Copy functionality
- Read-only view

### Workspace Screen (Editor)
- Separate view or modal
- Allows user to paste copied text
- Automatically processes pasted content

---

## Key Features

### 1. Search & Discovery
- Real-time filtering of paper list
- Lightweight and fast
- Supports partial matches

### 2. Paper Viewing
- Clean, readable text layout
- Optimized for scanning and selection
- No editing allowed in this view

### 3. Text Extraction
- Users can highlight and copy text from any paper
- No restrictions on selection size

### 4. Workspace Editing
- Dedicated screen for composing a new document
- Paste functionality inserts text into the document

### 5. Automatic Source Generation
When text is pasted:
- The system:
  - Identifies the originating paper
  - Attaches source metadata to the inserted text
- Sources are:
  - Automatically formatted
  - Linked to the original paper
  - Stored alongside the inserted content

Example:
> Pasted text block → automatically includes citation reference

---

## Data Model (Conceptual)

### Paper
- id
- title
- content
- metadata (author, date, etc.)

### Extracted Text Block
- text
- source_paper_id
- position (optional)
- timestamp

### Workspace Document
- id
- content (composed of multiple text blocks)
- sources (auto-generated list)

---

## User Flow

1. User opens GEMINI
2. Browses or searches for a paper
3. Clicks a paper → views content
4. Selects and copies text
5. Navigates to workspace
6. Pastes text
7. System:
   - Inserts text
   - Automatically generates source reference
8. User continues building document

---

## Design Principles

- **Clarity First**: Simple, distraction-free reading and editing
- **Seamless Flow**: Minimal friction between reading and writing
- **Automatic Attribution**: No manual citation required
- **Modularity**: Papers and extracted content are loosely coupled

---

## Future Enhancements (Optional)

- Inline citation formatting styles (APA, MLA, etc.)
- Highlight persistence across sessions
- Multi-document comparison view
- Drag-and-drop text extraction
- Source verification / provenance layer (e.g., signed metadata)

---

## Summary
GEMINI transforms passive reading into an active composition workflow, enabling users to quickly gather, reuse, and properly attribute information from multiple documents without breaking their flow.