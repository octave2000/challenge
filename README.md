# octaveeasyfabchallenge

 This is a desktop application built to help visualize and manipulate joints between square and rectangular tubes in a 3D space.

## Features

*   **Add Tubes:** You can add both square and rectangular tubes to the scene.
*   **3D Manipulation:** Select a tube by clicking on it, and a gizmo will appear, allowing you to move it around in the 3D space. The movement snaps to a grid to make alignment easier.
*   **Rotate Tubes:** Quickly rotate the selected tube to face North, South, East, or West with the click of a button.
*   **Wireframe Mode:** You can toggle a wireframe view to see the underlying structure of the tubes.

## Tech Stack

This project is built using a combination of modern technologies:

*   **Electron:** To package the application for desktop (Windows, macOS, and Linux).
*   **React:** For building the user interface.
*   **Three.js, @react-three/fiber, and @react-three/drei:** These libraries are used for all the 3D rendering and interaction. `@react-three/fiber` and `@react-three/drei` make it much easier to work with Three.js in a React application.
*   **Vite:** As a fast and modern build tool for the web components.
*   **Zustand:** For managing the application's state (like the properties of the tubes).

## Getting Started

If you want to get the project running on your local machine to play around with the code, here's how you can do it:

**1. Prerequisites:**

Before you begin, make sure you have [Node.js](https://nodejs.org/) installed on your computer.

**2. Installation:**

First, you'll need to install the project's dependencies. Open up your terminal, navigate to the project's directory, and run the following command:

```bash
bun install
```

**3. Running the App:**

Once the dependencies are installed, you can start the application in development mode with this command:

```bash
bun run dev
```

This will start the Vite development server and launch the Electron application. Any changes you make to the source code will automatically be reflected in the running application.

---

That's pretty much it! Feel free to dive into the code and see how it all works.
