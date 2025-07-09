# Contributing to Cab Booking System

Thank you for your interest in contributing to the Cab Booking System! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Git
- Basic understanding of Spring Boot and React

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/cab-booking-system.git
   cd cab-booking-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs
1. **Check existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots if applicable

### Suggesting Features
1. **Check existing feature requests**
2. **Use the feature request template**
3. **Provide clear description**:
   - Problem you're solving
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### Submitting Code Changes

#### Branch Naming Convention
```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue
chore/maintenance-task
```

#### Commit Message Format
```
type(scope): short description

Longer description if needed

Fixes #issue-number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add JWT token refresh functionality
fix(booking): resolve map loading issue on mobile
docs(api): update authentication endpoints documentation
```

## 🏗️ Development Guidelines

### Backend Development (Spring Boot)

#### Code Style
- Follow Java naming conventions
- Use meaningful variable and method names
- Add Javadoc comments for public methods
- Keep methods focused and small
- Follow SOLID principles

#### File Structure
```
src/main/java/com/cabbookingsystem/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # Data repositories
├── service/         # Business logic
├── security/        # Security configuration
└── exception/       # Custom exceptions
```

#### Best Practices
- Use dependency injection
- Implement proper error handling
- Write unit tests for services
- Use DTOs for API responses
- Validate input parameters
- Follow REST API conventions

### Frontend Development (React)

#### Code Style
- Use functional components with hooks
- Follow React naming conventions
- Use TypeScript for type safety (if applicable)
- Keep components small and focused
- Use meaningful component and variable names

#### File Structure
```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── services/       # API services
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── styles/         # CSS/SCSS files
└── types/          # Type definitions
```

#### Best Practices
- Use React hooks properly
- Implement proper error boundaries
- Handle loading and error states
- Use semantic HTML
- Ensure accessibility (a11y)
- Optimize for performance

### Database Guidelines

#### Entity Design
- Use proper relationships
- Add appropriate indexes
- Use meaningful column names
- Include audit fields (created_at, updated_at)
- Use appropriate data types

#### Migration Guidelines
- Write reversible migrations
- Test migrations on sample data
- Document schema changes
- Use descriptive migration names

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

**Test Types:**
- Unit tests for services
- Integration tests for repositories
- Controller tests with MockMvc
- End-to-end tests for critical flows

### Frontend Testing
```bash
cd frontend
npm run test
```

**Test Types:**
- Component unit tests
- Hook tests
- Integration tests
- E2E tests with Cypress

### Testing Guidelines
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies

## 📝 Documentation

### Code Documentation
- Add JSDoc/Javadoc comments
- Document complex logic
- Include usage examples
- Keep documentation up to date

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify error codes
- Update OpenAPI/Swagger specs

### User Documentation
- Update README for new features
- Add setup instructions
- Include troubleshooting guides
- Provide clear examples

## 🔍 Code Review Process

### Submitting PRs
1. **Create feature branch** from main
2. **Make your changes** following guidelines
3. **Write/update tests**
4. **Update documentation**
5. **Submit PR** with clear description

### PR Requirements
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] PR description is clear
- [ ] Breaking changes documented
- [ ] Issue referenced (if applicable)

### Review Criteria
- Code quality and maintainability
- Test coverage
- Documentation completeness
- Performance considerations
- Security implications

## 🏷️ Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes

### Release Steps
1. Update version numbers
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. Run integration tests
6. Deploy to production
7. Create GitHub release

## 🔧 Development Tools

### Recommended IDEs
- **Backend**: IntelliJ IDEA, Eclipse, VS Code
- **Frontend**: VS Code, WebStorm
- **Database**: DBeaver, DataGrip

### Useful Extensions
- **VS Code**: ES6 snippets, React snippets, Java Extension Pack
- **Chrome**: React Developer Tools, Vue DevTools

### Code Quality Tools
- **Backend**: SpotBugs, Checkstyle, PMD
- **Frontend**: ESLint, Prettier, SonarLint

## 🐛 Debugging

### Backend Debugging
- Use IDE debugger
- Add logging statements
- Use Spring Boot DevTools
- Monitor with Actuator

### Frontend Debugging
- Use browser DevTools
- React Developer Tools
- Console logging
- Network tab for API calls

## 📊 Performance Guidelines

### Backend Performance
- Use appropriate caching
- Optimize database queries
- Use pagination for large datasets
- Monitor memory usage
- Profile slow endpoints

### Frontend Performance
- Use React.memo for expensive components
- Lazy load components
- Optimize images
- Minimize bundle size
- Use proper state management

## 🔒 Security Guidelines

### Backend Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Use HTTPS in production
- Sanitize outputs

### Frontend Security
- Validate user inputs
- Use HTTPS for API calls
- Store sensitive data securely
- Implement CSP headers
- Regular dependency updates

## 🆘 Getting Help

### Resources
- **Documentation**: Check project README and docs
- **Issues**: Search existing issues
- **Discussions**: Use GitHub discussions
- **Code Review**: Ask for feedback in PRs

### Contact
- Create an issue for bugs/features
- Use discussions for questions
- Tag maintainers for urgent issues

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the Cab Booking System! 🚀
