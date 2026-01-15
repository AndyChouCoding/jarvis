# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0] - 2026-01-15

### Added
- **Fist Gesture**: New "Open Palm -> Fist" gesture triggers navigation to Home.
- **Gesture Optimization**:
    - Increased `PINCH_THRESHOLD` (0.1 -> 0.15) for easier clicking.
    - Added visual debug readout for pinch distance in camera HUD.
    - **Performance**: Throttled gesture tracking to 30 FPS and reduced resolution to 640x480 to prevent UI freezing.

### Changed
- **Dashboard Refinement**:
    - Removed "Dock" and fake mobile status bars for a cleaner Desktop-first experience.
    - Consolidated apps into a centered, responsive Grid layout.
    - Removed placeholder apps (Camera, Maps, Mail, etc.).

## [2.1.0] - 2026-01-15

### Added
- **Mobile-Style UI**:
    - **App Grid**: New home screen layout featuring large, touch-friendly icons.
    - **Dock**: Fixed bottom bar for frequently used apps.
    - **AppIcon**: Redesigned functional icons with glassmorphism and smooth animations.
- **Gesture Control (Restored)**:
    - Restored fully functional v2.0.0 gesture system (Pinch-to-Click, Virtual Cursor).
    - Fixed Z-index issues to ensure gestures work over the new UI.

### Changed
- **Header**: Simplified to a minimalist "Jarvis OS" header with Google Connection status.
- **Removed**: Legacy dashboard widgets (Calendar list, System status) replaced by App Icons.
- **Removed**: Decorative mobile status bar (Battery/WiFi) for a cleaner look.

## [2.0.0] - 2026-01-15

### Added
- **Google Workspace Integration**:
    - Authentication with Google Accounts.
    - Calendar access and management features.
- **Chat Interface**:
    - Complete chat UI with message history.
    - Integration with ADK agent backend.

## [1.0.0] - 2026-01-15

### Added
- Initial Release
