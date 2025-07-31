#!/bin/bash

# Script setup Docker cho dự án Comic
# Usage: ./scripts/docker-setup.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p mysql/init
    mkdir -p nginx/ssl
    mkdir -p scripts
    
    print_success "Directories created"
}

# Copy environment file
setup_environment() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_success ".env file created"
    else
        print_warning ".env file already exists"
    fi
}

# Build and start containers
start_containers() {
    local environment=$1
    
    if [ "$environment" = "dev" ]; then
        print_status "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build -d
    else
        print_status "Starting production environment..."
        docker-compose up --build -d
    fi
    
    print_success "Containers started"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MySQL
    print_status "Waiting for MySQL..."
    while ! docker exec comic_mysql mysqladmin ping -h"localhost" --silent; do
        sleep 2
    done
    print_success "MySQL is ready"
    
    # Wait for Backend
    print_status "Waiting for Backend..."
    while ! curl -f http://localhost:8000/health &> /dev/null; do
        sleep 5
    done
    print_success "Backend is ready"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    while ! curl -f http://localhost:3000 &> /dev/null; do
        sleep 5
    done
    print_success "Frontend is ready"
}

# Show status
show_status() {
    print_status "Checking container status..."
    docker-compose ps
    
    print_status "Application URLs:"
    echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "  Backend API: ${GREEN}http://localhost:8000${NC}"
    echo -e "  Nginx (if enabled): ${GREEN}http://localhost:80${NC}"
}

# Show logs
show_logs() {
    print_status "Showing recent logs..."
    docker-compose logs --tail=50
}

# Main function
main() {
    local environment=${1:-prod}
    
    print_status "Setting up Docker environment for Comic project..."
    
    check_docker
    create_directories
    setup_environment
    start_containers $environment
    wait_for_services
    show_status
    
    print_success "Setup completed successfully!"
    print_status "You can now access the application at http://localhost:3000"
    
    echo ""
    print_status "Useful commands:"
    echo -e "  View logs: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "  Stop services: ${YELLOW}docker-compose down${NC}"
    echo -e "  Restart services: ${YELLOW}docker-compose restart${NC}"
    echo -e "  Access MySQL: ${YELLOW}docker exec -it comic_mysql mysql -u comic_user -p${NC}"
}

# Handle command line arguments
case "${1:-prod}" in
    "dev")
        main "dev"
        ;;
    "prod")
        main "prod"
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    *)
        echo "Usage: $0 [dev|prod|logs|status]"
        echo "  dev   - Start development environment"
        echo "  prod  - Start production environment (default)"
        echo "  logs  - Show recent logs"
        echo "  status - Show container status"
        exit 1
        ;;
esac 