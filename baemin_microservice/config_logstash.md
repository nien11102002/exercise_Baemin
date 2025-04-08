 input {
   jdbc {
     jdbc_driver_library => "/usr/share/logstash/driver/postgresql-42.2.19.jar"
     jdbc_driver_class => "org.postgresql.Driver"
     jdbc_connection_string => "jdbc:postgresql:some-postgres:5432/db_baemin"
     jdbc_user => "postgres"
     jdbc_password => "1110"
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
     schedule => "* * * * *" 
   }
 }

 output {
   elasticsearch {
     hosts => ["https:elasticsearch:9200"]
     ssl => true
     ssl_certificate_verification => false 
     user => "elastic" 
     password => "h+LbjV6nHsD8DRoUE741" 
     index => "product-baemin-index"
     document_id => "%{branch_food_id}"
   }
   stdout { codec => rubydebug } 
 }
