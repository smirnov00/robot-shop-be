# robot-shop-be

## Configuration

Create the `product-service/secrets.json`:

```
{
  "pg": {
    "host": "<pg-host>",
    "db_name": "<db-name>",
    "user": "<db-user>",
    "password": "<db-password>"
  },
  "vpc": {
    "security_group_id": "<security-group-id>",
    "subnet_id_1": "<subnet-id-1>",
    "subnet_id_2": "<subnet-id-2>"
  }
}

```

## Deploy
```
npm run deploy
```

## Generate mock products
```
npm run generate-mock-products:csv -- --rows=100
```
The generated data will be stored to the `./utils/mock-data/data-set.csv`

Example of generated product:
```
{
	"id": "af6b66f3-2816-4d4d-82e2-e972c4c975e7",
	"title": "Kathlin",
	"description": "Environmental Specialist",
	"image": "https://robohash.org/sitducimusmolestiae.png?size=500x500&set=set1",
	"count": 10,
	"price": 616.28
}
```

## Swagger
`swagger.yaml` could be found in the project's root directory.
