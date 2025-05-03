<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/luca-naujoks/anistream-api/blob/development/public/icon.png" width="120" alt="AniStream Logo" /></a>
    <h1 align="center">AniStream Observatory</h1>
</p>

  <p align="center">A feature rich and efficient Media Server Backend on top of <a href="https://nestjs.com" target="_blank">NestJS</a>.
  </p>
</p>

## Description

The vision of the AniStream API is to provide a solid foundation for local media servers.
It should provide a base of functionality and connect the local storage to a beautiful web UI of your choice, while being modular and extensible.

## Project setup

```bash
# Clone the Repository
$ git clone https://github.com/luca-naujoks/anistream-api.git

# Move into project directory
$ cd anistream-api

# install all dependencies
$ npm install
```

## Compile and run the project

```bash
# build the project
$ npm run build

# start in production mode
$ npm run start:prod
```

## Docker Deployment

The AniStream-Api is available as a Docker image hosted on the GitHub Container Registry. You can pull the image and run it directly or use Docker Compose for a more integrated setup with the AniStream Web UI.

#### Pull and Run the Docker Image

```bash
# Pull the AniStream image from GitHub Container Registry
$ docker pull ghcr.io/luca-naujoks/anistream:latest

# Run the container
$ docker run -d -p 3000:3000 --name anistream ghcr.io/luca-naujoks/anistream:latest
```

### Docker Compose with AniStream API

To deploy the AniStream Api alongside the AniStream Web UI, create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

services:
  anistream-api:
    image: ghcr.io/luca-naujoks/anistream-api:latest
    container_name: anistream-api
    ports:
      - '3001:3001'
    volumes:
      - /home/anistream-api/configuration:/app/configuration

  anistream:
    image: ghcr.io/luca-naujoks/anistream:latest
    container_name: anistream
    ports:
      - '3000:3000'
    volumes:
      - /home/anistream-api/config:/app/config
    depends_on:
      - anistream-api
```

#### Deploy with Docker Compose

```bash
# Start the services
$ docker-compose up -d
```

You can now access your fully deployed Anistream instance at `<your-ip-address>`:3000, where you can start the setup process by connecting the Web App to the API.

Tip: The API should be accessible at `<your-ip-address>`:3001.

## Resources

Check out a few resources that may come in handy when working with this Project:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For Informations about Docker click [here](https://docs.docker.com).
- If you are interested in a Web UI that is using the AniStream API feel free to check out my Other Project [AniStream](https://github.com/luca-naujoks/anistream)

## Stay in touch

- Author - [luca-naujoks](https://github.com/luca-naujoks)

## License

AniStream is [MIT licensed](https://github.com/luca-naujoks/anistream-api/blob/development/LICENSE).
