# Coding Standards

This document outlines our project's coding standards and best practices. All code changes must adhere to these guidelines.

## General Principles

- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principles
- Write testable code
- Prioritize accessibility
- Use a mobile-first approach
- Maintain consistent formatting

## Code Style

### Naming Conventions
- Use **camelCase** for variable and function names
- Use **PascalCase** for component names and types/interfaces
- Use **UPPER_SNAKE_CASE** for constants
- Use descriptive names that indicate purpose

```typescript
// Good
const userProfile = {};
function calculateTotalPrice() {}
interface UserPreferences {}
const MAX_RETRY_ATTEMPTS = 3;

// Bad
const data = {};
function calc() {}
interface IData {}
const max = 3;
```

### Formatting
- Use 4 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Maximum line length: 100 characters

### TypeScript
- Use TypeScript for all new code
- Define explicit types for props and state
- Avoid using `any` type
- Use interfaces for object types
- Use type unions/intersections when appropriate

```typescript
// Good
interface WeatherData {
    temperature: number;
    conditions: string;
    timestamp: Date;
}

function WeatherDisplay({ data }: { data: WeatherData }) {
    // ...
}

// Bad
function WeatherDisplay({ data }: { data: any }) {
    // ...
}
```

### React Components
- One component per file
- Use functional components with hooks
- Props should be typed with interfaces
- Destructure props in component parameters
- Use CSS modules for styling

```typescript
// Good
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
    temperature: number;
    conditions: string;
    onRefresh: () => void;
}

export function WeatherCard({ temperature, conditions, onRefresh }: WeatherCardProps) {
    return (
        <div className={styles.card}>
            {/* Component content */}
        </div>
    );
}
```

### CSS/Styling
- Use CSS modules for component styles
- Follow BEM-like naming in CSS modules
- Use CSS variables for theming
- Mobile-first responsive design
- Maintain consistent spacing units

```css
/* Good */
.card {
    padding: var(--spacing-md);
}

.card__title {
    font-size: var(--font-size-lg);
}

.card__button--primary {
    background: var(--color-primary);
}
```

### JavaScript Features
- Use ES6+ features appropriately
- Use arrow functions for callbacks
- Use async/await for asynchronous code
- Use destructuring for objects and arrays
- Use template literals for string interpolation

```typescript
// Good
const { temperature, conditions } = weatherData;
const formattedMessage = `Current temperature: ${temperature}°`;
const fetchData = async () => {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
};

// Bad
const temperature = weatherData.temperature;
const formattedMessage = 'Current temperature: ' + temperature + '°';
function fetchData() {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Failed to fetch:', error));
}
```

## Testing
- Write tests for all new features
- Use Jest and React Testing Library
- Test components in isolation
- Write meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('WeatherCard', () => {
    it('displays the temperature and conditions', () => {
        // Arrange
        const props = {
            temperature: 72,
            conditions: 'Sunny',
            onRefresh: jest.fn(),
        };

        // Act
        render(<WeatherCard {...props} />);

        // Assert
        expect(screen.getByText('72°')).toBeInTheDocument();
        expect(screen.getByText('Sunny')).toBeInTheDocument();
    });
});
```

## Git Practices
- Write clear, descriptive commit messages
- Use feature branches for new work
- Keep commits focused and atomic
- Follow conventional commits format

```bash
# Good commit messages
git commit -m "feat: add temperature unit toggle"
git commit -m "fix: correct temperature conversion formula"
git commit -m "docs: update API documentation"

# Bad commit messages
git commit -m "updates"
git commit -m "fix stuff"
```

## Code Review
- Review for adherence to these standards
- Check for accessibility compliance
- Verify test coverage
- Ensure proper error handling
- Look for potential performance issues

## Tools and Configuration
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Jest for testing
- Husky for pre-commit hooks

## Documentation
- Document complex functions and components
- Include JSDoc comments for public APIs
- Keep README files up to date
- Document accessibility considerations 