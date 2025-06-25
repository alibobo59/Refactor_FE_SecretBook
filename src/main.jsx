import App from "./App";
import "./index.css";
import { BookProvider } from "./contexts/BookContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { OrderProvider } from "./contexts/OrderContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { RecommendationProvider } from "./contexts/RecommendationContext";
import LanguageProvider from "./contexts/LanguageContext";
import ReactDOM from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <BookProvider>
              <CartProvider>
                <OrderProvider>
                  <ReviewProvider>
                    <RecommendationProvider>
                      <App />
                    </RecommendationProvider>
                  </ReviewProvider>
                </OrderProvider>
              </CartProvider>
            </BookProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);