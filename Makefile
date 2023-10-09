install:
	cd client && npm install
	cd server && npm install
	
start:
	docker compose up --build

stop: 
	docker compose down

