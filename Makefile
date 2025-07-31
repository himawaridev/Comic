# Makefile cho dự án Comic
.PHONY: help build up down logs clean dev prod status health

# Default target
help:
	@echo "Comic Project - Docker Management"
	@echo ""
	@echo "Commands:"
	@echo "  make build     - Build Docker images"
	@echo "  make up        - Start production environment"
	@echo "  make down      - Stop all containers"
	@echo "  make logs      - Show logs"
	@echo "  make clean     - Clean up containers and images"
	@echo "  make dev       - Start development environment"
	@echo "  make prod      - Start production environment"
	@echo "  make status    - Show container status"
	@echo "  make health    - Check health of services"
	@echo "  make shell     - Access backend container shell"
	@echo "  make db        - Access MySQL database"
	@echo "  make backup    - Backup database"
	@echo "  make restore   - Restore database from backup"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start production environment
up:
	@echo "Starting production environment..."
	docker-compose up -d

# Stop all containers
down:
	@echo "Stopping containers..."
	docker-compose down

# Show logs
logs:
	@echo "Showing logs..."
	docker-compose logs -f

# Clean up containers and images
clean:
	@echo "Cleaning up..."
	docker-compose down -v --rmi all
	docker system prune -f

# Development environment
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build -d

# Production environment
prod:
	@echo "Starting production environment..."
	docker-compose up --build -d

# Show container status
status:
	@echo "Container status:"
	docker-compose ps

# Check health of services
health:
	@echo "Checking service health..."
	@echo "Backend health:"
	@curl -f http://localhost:8000/health || echo "Backend is not responding"
	@echo ""
	@echo "Frontend health:"
	@curl -f http://localhost:3000 || echo "Frontend is not responding"
	@echo ""
	@echo "MySQL health:"
	@docker exec comic_mysql mysqladmin ping -h localhost --silent || echo "MySQL is not responding"

# Access backend container shell
shell:
	@echo "Accessing backend container shell..."
	docker exec -it comic_backend sh

# Access MySQL database
db:
	@echo "Accessing MySQL database..."
	docker exec -it comic_mysql mysql -u comic_user -p comic

# Backup database
backup:
	@echo "Creating database backup..."
	docker exec comic_mysql mysqldump -u comic_user -p comic > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created: backup_$(shell date +%Y%m%d_%H%M%S).sql"

# Restore database from backup
restore:
	@if [ -z "$(file)" ]; then \
		echo "Usage: make restore file=backup_file.sql"; \
		exit 1; \
	fi
	@echo "Restoring database from $(file)..."
	docker exec -i comic_mysql mysql -u comic_user -p comic < $(file)
	@echo "Database restored successfully"

# Setup project
setup:
	@echo "Setting up project..."
	@chmod +x scripts/docker-setup.sh
	@./scripts/docker-setup.sh prod

# Development setup
setup-dev:
	@echo "Setting up development environment..."
	@chmod +x scripts/docker-setup.sh
	@./scripts/docker-setup.sh dev

# Restart services
restart:
	@echo "Restarting services..."
	docker-compose restart

# Rebuild and restart
rebuild:
	@echo "Rebuilding and restarting services..."
	docker-compose up --build -d

# Show resource usage
resources:
	@echo "Container resource usage:"
	docker stats --no-stream

# Network information
network:
	@echo "Network information:"
	docker network ls
	@echo ""
	@echo "Comic network details:"
	docker network inspect comic_comic_network || echo "Network not found" 