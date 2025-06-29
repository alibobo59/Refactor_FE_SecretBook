import App from "./App";
import "./index.css";
import { BookProvider } from "./contexts/BookContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { OrderProvider } from "./contexts/OrderContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { RecommendationProvider } from "./contexts/RecommendationContext";
import { LogProvider } from "./contexts/LogContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { MarketingProvider } from "./contexts/MarketingContext";
import { SecurityProvider } from "./contexts/SecurityContext";
import { ContentProvider } from "./contexts/ContentContext";
import LanguageProvider from "./contexts/LanguageContext";
import ToastContainer from "./components/common/ToastContainer";
import ReactDOM from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <LogProvider>
              <NotificationProvider>
                <AnalyticsProvider>
                  <MarketingProvider>
                    <SecurityProvider>
                      <ContentProvider>
                        <BookProvider>
                          <CartProvider>
                            <OrderProvider>
                              <ReviewProvider>
                                <RecommendationProvider>
                                  <App />
                                  <ToastContainer />
                                </RecommendationProvider>
                              </ReviewProvider>
                            </OrderProvider>
                          </CartProvider>
                        </BookProvider>
                      </ContentProvider>
                    </SecurityProvider>
                  </MarketingProvider>
                </AnalyticsProvider>
              </NotificationProvider>
            </LogProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);