src/
├── domain/ # Core business logic (no external dependencies)
│ ├── aggregates/
│ │ └── order/
│ │ ├── Order.js # Aggregate root
│ │ ├── OrderItem.js # Entity within aggregate
│ │ └── Order.test.js
│ ├── entities/
│ │ └── Product.js
│ ├── value-objects/
│ │ ├── Money.js
│ │ ├── Address.js
│ │ └── Email.js
│ ├── domain-events/
│ │ ├── OrderPlaced.js
│ │ └── OrderCancelled.js
│ ├── repositories/ # Interfaces/contracts only
│ │ └── IOrderRepository.js
│ ├── services/ # Domain services (stateless logic spanning aggregates)
│ │ └── PricingService.js
│ └── exceptions/
│ └── OrderNotFoundException.js
│
├── application/ # Use cases / application services
│ ├── commands/
│ │ ├── PlaceOrder.command.js
│ │ └── CancelOrder.command.js
│ ├── queries/
│ │ └── GetOrderById.query.js
│ ├── handlers/
│ │ ├── PlaceOrderHandler.js
│ │ └── CancelOrderHandler.js
│ ├── dtos/
│ │ ├── OrderDTO.js
│ │ └── OrderItemDTO.js
│ └── services/ # Orchestration (calls domain + infra)
│ └── OrderApplicationService.js
│
├── infrastructure/ # Concrete implementations & external concerns
│ ├── persistence/
│ │ ├── models/ # ORM models (Mongoose, Sequelize, etc.)
│ │ │ └── OrderModel.js
│ │ ├── repositories/ # Concrete implementations of domain interfaces
│ │ │ └── MongoOrderRepository.js
│ │ └── mappers/ # ORM model ↔ Domain entity mapping
│ │ └── OrderMapper.js
│ ├── messaging/
│ │ ├── EventBus.js
│ │ └── subscribers/
│ │ └── SendEmailOnOrderPlaced.js
│ ├── http/
│ │ ├── controllers/
│ │ │ └── OrderController.js
│ │ ├── middlewares/
│ │ │ ├── auth.js
│ │ │ └── errorHandler.js
│ │ ├── routes/
│ │ │ └── order.routes.js
│ │ └── validators/
│ │ └── orderValidator.js
│ └── config/
│ ├── database.js
│ └── env.js
│
├── shared/ # Shared kernel (used across bounded contexts)
│ ├── aggregate-root.ts # Base Aggregate class
│ ├── fact.js # Base Domain Event class
│
└── main.js # App bootstrap / composition root
