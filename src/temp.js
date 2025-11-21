{
    "name": "Order Management",
    "item": [
    {
        "name": "add order",
        "event": [
            {
                "listen": "test",
                "script": {
                    "exec": [
                        "pm.test(\"Status code is 201\", () => pm.response.to.have.status(201));",
                        "pm.test(\"Order created with ID\", () => {",
                        "    const json = pm.response.json();",
                        "    pm.expect(json).to.have.property('_id');",
                        "    pm.environment.set('orderId', json._id);",
                        "});",
                        "pm.test(\"Order has status\", () => {",
                        "    const status = pm.response.json().status;",
                        "    pm.expect(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).to.include(status);",
                        "});",
                        "pm.test(\"Order has totalPrice\", () => pm.expect(pm.response.json()).to.have.property('totalPrice'));",
                        "pm.test(\"Response time < 2s\", () => pm.expect(pm.response.responseTime).to.be.below(2000));"
                    ],
                    "type": "text/javascript",
                    "packages": {},
                    "requests": {}
                }
            }
        ],
        "request": {
            "auth": {
                "type": "bearer",
                "bearer": [
                    {
                        "key": "token",
                        "value": "{{accessToken}}",
                        "type": "string"
                    }
                ]
            },
            "method": "POST",
            "header": [
                {
                    "key": "Accept",
                    "value": "application/json",
                    "type": "text"
                }
            ],
            "url": {
                "raw": "{{baseURL}}/api/orders/addOrder/{{cartId}}",
                "host": ["{{baseURL}}"],
                "path": ["api", "orders", "addOrder", "{{cartId}}"]
            }
        },
        "response": []
    },
    {
        "name": "get user's orders",
        "event": [
            {
                "listen": "test",
                "script": {
                    "exec": [
                        "pm.test(\"Status code is 200\", () => pm.response.to.have.status(200));",
                        "pm.test(\"Response is array\", () => pm.expect(pm.response.json()).to.be.an('array'));",
                        "pm.test(\"Orders have required fields\", () => {",
                        "    const orders = pm.response.json();",
                        "    if (orders.length > 0) {",
                        "        pm.expect(orders[0]).to.have.property('status');",
                        "        pm.expect(orders[0]).to.have.property('totalPrice');",
                        "    }",
                        "});",
                        "pm.test(\"Response time < 1s\", () => pm.expect(pm.response.responseTime).to.be.below(1000));"
                    ],
                    "type": "text/javascript",
                    "packages": {},
                    "requests": {}
                }
            }
        ],
        "request": {
            "method": "GET",
            "header": [],
            "url": {
                "raw": "{{baseURL}}/api/orders/getOrder",
                "host": ["{{baseURL}}"],
                "path": ["api", "orders", "getOrder"]
            }
        },
        "response": []
    },
    {
        "name": "change order's status",
        "event": [
            {
                "listen": "test",
                "script": {
                    "exec": [
                        "pm.test(\"Status code is 200\", () => pm.response.to.have.status(200));",
                        "pm.test(\"Order status updated\", () => pm.expect(pm.response.json()).to.have.property('status'));",
                        "pm.test(\"Valid status\", () => {",
                        "    const status = pm.response.json().status;",
                        "    pm.expect(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).to.include(status);",
                        "});",
                        "pm.test(\"Response time < 1s\", () => pm.expect(pm.response.responseTime).to.be.below(1000));"
                    ],
                    "type": "text/javascript",
                    "packages": {},
                    "requests": {}
                }
            }
        ],
        "request": {
            "auth": {
                "type": "bearer",
                "bearer": [
                    {
                        "key": "token",
                        "value": "{{accessToken}}",
                        "type": "string"
                    }
                ]
            },
            "method": "PUT",
            "header": [],
            "body": {
                "mode": "raw",
                "raw": "{\r\n    \"status\" : \"paid\"\r\n}",
                "options": {
                    "raw": {
                        "language": "json"
                    }
                }
            },
            "url": {
                "raw": "{{baseURL}}/api/orders/updateStatus/{{orderId}}",
                "host": ["{{baseURL}}"],
                "path": ["api", "orders", "updateStatus", "{{orderId}}"]
            }
        },
        "response": []
    }
]
} ,


[
    {
        "_id": "692044d960f83e9c49540f74",
        "userId": "690b72345d563046ad98c211",
        "items": [
            {
                "productId": {
                    "_id": "6920418160f83e9c49540801",
                    "title": "makla ghalya btaman rkhis",
                    "description": "Not a camera but no one will know hahaha",
                    "prix": 10,
                    "stock": 15,
                    "images": [
                        "https://res.cloudinary.com/dbrrmsoit/image/upload/v1763722311/products/jcku4irlplsv49regnzy.webp"
                    ],
                    "isDelete": false,
                    "categories": [
                        "691ce6b3adbc75e493ccb829",
                        "69203e2860f83e9c4953997c"
                    ],
                    "createdBy": "690b720f5d563046ad98c20c",
                    "averageRating": 0,
                    "reviews": [],
                    "createdAt": "2025-11-21T10:40:01.831Z",
                    "updatedAt": "2025-11-21T10:51:51.931Z",
                    "__v": 0
                },
                "quantity": 2,
                "price": 10,
                "_id": "6920449760f83e9c495409f1"
            },
            {
                "productId": {
                    "_id": "69203eab60f83e9c4953ad41",
                    "title": "sbaaat mjhd",
                    "description": "korsi dl borjwaz",
                    "prix": 450,
                    "stock": 30,
                    "images": [
                        "https://res.cloudinary.com/dbrrmsoit/image/upload/v1763722268/products/xmd38unnzqhqplmirqnj.webp"
                    ],
                    "isDelete": false,
                    "categories": [
                        "69203e3360f83e9c49539b3a",
                        "69203e2860f83e9c4953997c"
                    ],
                    "createdBy": "690b720f5d563046ad98c20c",
                    "averageRating": 0,
                    "reviews": [],
                    "createdAt": "2025-11-21T10:27:55.004Z",
                    "updatedAt": "2025-11-21T10:51:24.322Z",
                    "__v": 0
                },
                "quantity": 4,
                "price": 450,
                "_id": "692044af60f83e9c495409f7"
            },
            {
                "productId": {
                    "_id": "69202bf460f83e9c49527eb3",
                    "title": "salah",
                    "description": "kayswa alkatir wlkn 3azib",
                    "prix": 122222,
                    "stock": 1,
                    "images": [
                        "https://res.cloudinary.com/dbrrmsoit/image/upload/v1763716083/products/momxwg5qqyqkg7cpxxji.webp"
                    ],
                    "isDelete": false,
                    "categories": [
                        "691ce6b3adbc75e493ccb829"
                    ],
                    "createdBy": "690b720f5d563046ad98c20c",
                    "averageRating": 0,
                    "reviews": [],
                    "createdAt": "2025-11-21T09:08:04.085Z",
                    "updatedAt": "2025-11-21T09:08:04.085Z",
                    "__v": 0
                },
                "quantity": 1,
                "price": 122222,
                "_id": "692044ce60f83e9c49540dbf"
            }
        ],
        "totalPrice": 124042,
        "status": "pending",
        "coupon": null,
        "discount": 0,
        "finalTotal": 124042,
        "updatedAt": "2025-11-21T10:54:17.717Z",
        "createdAt": "2025-11-21T10:54:17.717Z",
        "__v": 0
    }
]