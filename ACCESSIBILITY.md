# Accessibility Standards

This document outlines our project-wide accessibility standards and requirements. All code changes, new features, and components must adhere to these guidelines.

## Core Principles

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: User interface components must be operable by all users
- **Understandable**: Information and operation must be understandable
- **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents

## Technical Requirements

### 1. Semantic HTML and Structure
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- Maintain logical heading hierarchy (h1-h6)
- Use proper list elements for related items (`<ul>`, `<ol>`, `<dl>`)
- Structure content in a logical reading order
- Use HTML landmarks appropriately

### 2. ARIA Implementation
```tsx
// Good Example
<button 
    aria-expanded={isOpen}
    aria-controls="menu-content"
    aria-label="Toggle menu"
>
    {isOpen ? 'Close' : 'Open'} Menu
</button>

// Bad Example
<div onClick={toggleMenu}>
    Menu
</div>
```

### 3. Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators are required
- Logical tab order following visual layout
- No keyboard traps
- Skip links for main content
- Custom keyboard shortcuts must be documented

### 4. Forms and Inputs
```tsx
// Good Example
<div role="group" aria-labelledby="group-label">
    <label id="group-label">Contact Information</label>
    <label htmlFor="name">Name:</label>
    <input 
        id="name"
        type="text"
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby="name-error"
    />
    {hasError && (
        <div id="name-error" role="alert">
            Please enter a valid name
        </div>
    )}
</div>
```

### 5. Images and Media
```tsx
// Good Example
<img 
    src="weather-icon.png" 
    alt="Partly cloudy with light rain"
    role="img"
/>

// For decorative images
<img 
    src="background-pattern.png" 
    alt=""
    role="presentation"
/>
```

### 6. Color and Contrast
- Text contrast ratio requirements:
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - UI components and graphics: 3:1 minimum
- Never rely on color alone to convey information
- Support high contrast mode
- Ensure sufficient contrast for interactive elements

### 7. Dynamic Content
```tsx
// Good Example
<div 
    role="alert"
    aria-live="polite"
    aria-atomic="true"
>
    {weatherUpdateMessage}
</div>
```

### 8. Motion and Animation
```tsx
// Good Example
const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationStyles = {
    transition: hasReducedMotion ? 'none' : 'transform 0.3s ease',
};
```

### 9. Error Handling
- Clear error messages
- Error messages must be programmatically associated with their inputs
- Screen readers must be notified of errors
- Provide suggestions for correction when possible

### 10. Testing Requirements
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation testing
- Color contrast verification
- Browser compatibility testing
- Reduced motion testing
- High contrast mode testing

## Component Development Guidelines

### React Component Checklist
1. **Semantic Structure**
```tsx
// Good Example
export function WeatherCard({ data }) {
    return (
        <article aria-labelledby="weather-title">
            <h2 id="weather-title">{data.location}</h2>
            <div role="status" aria-live="polite">
                Current temperature: {data.temperature}°
            </div>
        </article>
    );
}
```

2. **Interactive Elements**
```tsx
// Good Example
export function ToggleButton({ isPressed, onToggle, children }) {
    return (
        <button
            aria-pressed={isPressed}
            onClick={onToggle}
            onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    onToggle();
                }
            }}
        >
            {children}
        </button>
    );
}
```

3. **Focus Management**
```tsx
// Good Example
export function Modal({ isOpen, onClose, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusableElements[0]?.focus();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={modalRef}
            aria-modal="true"
            open={isOpen}
        >
            {children}
        </dialog>
    );
}
```

## Development Process

1. **Planning Phase**
   - Include accessibility requirements in feature specifications
   - Consider keyboard interactions
   - Plan for screen reader announcements
   - Document required ARIA attributes

2. **Implementation Phase**
   - Follow semantic HTML best practices
   - Implement proper ARIA attributes
   - Ensure keyboard accessibility
   - Test with screen readers during development

3. **Testing Phase**
   - Automated accessibility testing (e.g., jest-axe)
   - Manual keyboard navigation testing
   - Screen reader testing
   - High contrast mode testing
   - Reduced motion testing

4. **Code Review**
   - Verify semantic HTML usage
   - Check ARIA implementation
   - Review keyboard accessibility
   - Validate color contrast
   - Ensure proper error handling

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [NextJS Accessibility](https://nextjs.org/docs/accessibility)

## Testing Tools

- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/)
- [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)
- Screen Readers:
  - NVDA (Windows)
  - VoiceOver (macOS)
  - TalkBack (Android)
  - VoiceOver (iOS) 