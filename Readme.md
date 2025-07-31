// DATABASE SETUP

mysql -u root -p

CREATE DATABASE hotel*management;
USE hotel_management;
SELECT * FROM rooms;
SELECT \_ FROM bookings;

// SERVER

{{server}} = http://localhost:5001/api/v1
search api {{server}}/customers/search?name=tar&phone=99
:id api {{server}}/customers/2

create booking {{server}}/bookings/create
