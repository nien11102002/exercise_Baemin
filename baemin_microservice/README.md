# Run this first in Kibana (set up for logstash so that can search in unaccent mode)

PUT /product-baemin-index
{
"settings": {
"analysis": {
"filter": {
"my_ascii_folding": {
"type": "asciifolding",
"preserve_original": true
}
},
"analyzer": {
"folding_analyzer": {
"tokenizer": "standard",
"filter": [
"lowercase",
"my_ascii_folding"
]
}
}
}
},
"mappings": {
"properties": {
"food_name": {
"type": "text",
"analyzer": "folding_analyzer"
},
"food_type_name": {
"type": "text",
"analyzer": "folding_analyzer"
}
}
}
}

# CONFIG FILE LOGSTASH.CONF in CONTAINER LOGSTASH (remember to adjust the layout and remove comment)

input {
jdbc {
jdbc_driver_library => "/usr/share/logstash/driver/postgresql-42.2.19.jar"
jdbc_driver_class => "org.postgresql.Driver"
jdbc_connection_string => "jdbc:postgresql:some-postgres:5432/db_baemin" <!-- Change info if necessary -->
jdbc_user => "postgres"
jdbc_password => "" <!-- Input postgres password -->
statement => "
SELECT
bf.id AS branch_food_id,
f.id AS food_id,
f.name AS food_name,
f.image AS food_image,
ft.name AS food_type_name,
b.id AS branch_id,
b.address AS branch_address,
br.name AS brand_name
FROM branch_foods bf
JOIN foods f ON bf.food_id = f.id
LEFT JOIN food_types ft ON f.type_id = ft.id
JOIN branches b ON bf.branch_id = b.id
JOIN brands br ON b.brand_id = br.id
"
schedule => "\* \* \* \* \*" <!-- Remove '\' -->
}
}

output {
elasticsearch {
hosts => ["https:elasticsearch:9200"]
ssl => true
ssl_certificate_verification => false
user => "elastic"
password => "" <!-- Input elasticsearch password -->
index => "product-baemin-index"
document_id => "%{branch_food_id}"
}
stdout { codec => rubydebug }
}

# File .env api_gateway and service_user

DATABASE_URL="postgresql://postgres:password@localhost:port/db_baemin" <!-- input password and port -->

ACCESS_TOKEN_SECRET="ACCESSTOKEN_SECRET_KEY"
ACCESS_TOKEN_EXPIRES="3h"

REFRESH_TOKEN_SECRET="REFESHTOKEN_SECRET_KEY"
REFRESH_TOKEN_EXPIRES="7d"

# File .env service_product

DATABASE_URL="postgresql://postgres:password@localhost:port/db_baemin" <!-- input password and port -->

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS= <!-- Input redis password -->  
REDIS_TTL=100

ELASTIC_NODE=https://localhost:9200
ELASTIC_USER=elastic
ELASTIC_PASS= <!-- Input elasticsearch password -->

# File .env service_cart, service_order, service_shipping

DATABASE_URL="postgresql://postgres:password@localhost:port/db_baemin" <!-- input password and port -->
