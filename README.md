# RoastMaster 🍖

A smart cooking companion designed to help you plan, time, and cook the perfect Sunday Roast. RoastMaster takes the stress out of timing multiple ingredients by generating a precise, step-by-step schedule based on your specific meal configuration.

🔗 **Live Demo:** [https://architools.drawingtable.net/RoastMaster/](https://architools.drawingtable.net/RoastMaster/)

## ✨ Features

*   **Smart Scheduling:** Automatically calculates cooking times, resting periods, and oven sequencing based on meat weight and type.
*   **Customizable Main Course:**
    *   Supports Beef, Chicken, Lamb, Pork, Turkey, and Gammon.
    *   **Beef Doneness:** Choose between Rare, Medium, or Well Done, with automatically adjusted cooking times.
*   **Sides & Extras:**
    *   Select vegetables and cooking methods (Roast, Boil, Mash).
    *   Add extras like Gravy, Stuffing, and **Yorkshire Puddings** (supports both Homemade and Packet timings).
*   **Flexible Timer:**
    *   **Start Now:** Instantly calculate when dinner will be ready if you start cooking immediately.
    *   **Plan Ahead:** Set your desired serving time, and the app tells you exactly when to start.
    *   **Live Sequence:** See a clear timeline of actions with absolute clock times (e.g., "11:06 - Put Potatoes In").
    *   **Sleep Resilience:** The timer syncs with your system clock, ensuring accurate alerts even if your device screen sleeps.
*   **Beautiful UI:** A clean, modern interface designed with Tailwind CSS v4, featuring a consistent emerald theme and custom icons.

## 🛠️ Tech Stack

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **Build Tool:** Vite
*   **Icons:** Lucide React

## 🚀 Run Locally

**Prerequisites:** Node.js (v18+ recommended)

1.  **Clone the repository:**
    ```bash
    git clone git@github.com-personal:Al4st41r/RoastMaster.git
    cd RoastMaster
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```