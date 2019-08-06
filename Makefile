up:
	sudo docker-compose up -d

app:
	sudo docker exec -it devspace_svelte_frontend bash

down:
	sudo docker-compose down

view:
	google-chrome public/index.html