# VoltPoint – EV Charging Station Manager

VoltPoint is a full-stack web application to manage EV charging stations. It includes user authentication, CRUD operations for charging stations, and a map view to locate all available chargers.

##### front-end - https://voltpoint-duck.vercel.app/ 
##### back-end - https://voltpoint.onrender.com

---
### Note on Backend Deployment (Render)
The backend is hosted on Render (free tier), which means:

After periods of inactivity, the free instance may spin down. When this happens, the first request can take 50 seconds or more to respond while the server wakes up.

Tip
If you're using the frontend and notice that requests to the backend are slow at first — don't worry, just wait a few moments. The server will be up and running shortly.

##  Getting Started

This project is divided into two main parts:

* **Frontend** (`fe/`)
* **Backend** (`be/`)

### Install Dependencies

For both frontend and backend, you need to install the required dependencies.

```bash
# For frontend
cd fe
npm install

# For backend
cd ../be
npm install
```

###  Configure MongoDB

Before running the backend, make sure to update your **MongoDB connection string** in the configuration file (e.g., `.env` or `config.js` inside the `be/` folder).

---

###  Run the Project

Once dependencies are installed and MongoDB is configured, you can run both parts:

```bash
# Start frontend
cd fe
npm start

# Start backend
cd ../be
npm start
```

---
### Testing API with Postman

A Postman collection is included to help you test the backend routes.