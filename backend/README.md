# Creating .env
The env variables you will need are located in the env-example file

# Creating the tables in pgAdmin:

```bash
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'user')) NOT NULL
);

CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    category VARCHAR(20) CHECK (category IN ('individual', 'group')) NOT NULL, 
    image TEXT,
    description TEXT,
    duration INT NOT NULL,       -- Stores duration in minutes        
    price DECIMAL(10,2) NOT NULL,
);

CREATE TABLE dates (
    id SERIAL PRIMARY KEY,
    tour_id INT NOT NULL,
    tour_date TIMESTAMP NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date_id INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed')) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (date_id) REFERENCES dates(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- Indexes to foreign keys for performance
CREATE INDEX idx_dates_tour_id ON dates(tour_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_date_id ON registrations(date_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_tour_id ON reviews(tour_id);

```