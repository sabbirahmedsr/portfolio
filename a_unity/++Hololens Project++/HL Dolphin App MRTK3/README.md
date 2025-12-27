# HL-Dolphin-App-MRTK3 | Unity 6000.2.8f1
![Project Screenshot](./README_SS.PNG)

An interactive HoloLens 2 application featuring a virtual dolphin. This project is built with Unity and MRTK3, and includes several interactive experiences such as fish feeding, bubble popping, and more.

---

## 🔗 Quick Links

| [GitHub](https://github.com/sabbirahmedsr/HL-Dolphin-App-MRTK3) | [GitLab](https://gitlab.com/sabbirahmedsr/hl-dolphin-app-mrtk3) | [Attribution](./Assets/Info/Attribute.md) | [Requirements](./Assets/Info/Requirement.md) |
| :---: | :---: | :---: | :---: |

---

## 📅 Project Timeline

This project officially started in **October 2025** and ran until **November 2025**.

| Proposal Discussion | Project Start | Project Completion | Duration |
| :---: | :---: | :---: | :---: |
| September 2025 | **October 2025** | November 2025 | 5 Weeks |

---

## ✨ Key Features

* **Immersive Virtual Dolphin:** A fully animated dolphin that interacts realistically with the mixed-reality environment.
* **Hand-Tracked Interactions:** Includes **Fish Feeding** and **Bubble Popping** mechanics using MRTK3's hand tracking.
* **Intuitive UX:** Built with MRTK3's UI components for simple, gaze-and-hand-based control.

---

## 📂 Repositories

This project is maintained on both GitHub and GitLab. Please use the links below to access the repositories.

*   **GitHub:** [https://github.com/sabbirahmedsr/HL-Dolphin-App-MRTK3](https://github.com/sabbirahmedsr/HL-Dolphin-App-MRTK3)
*   **GitLab:** [https://gitlab.com/sabbirahmedsr/hl-dolphin-app-mrtk3](https://gitlab.com/sabbirahmedsr/hl-dolphin-app-mrtk3)

---

## ⚙️ Requirements & Dependencies

* **Unity Editor:** **6000.2.8f1** (Tested version)
* **Operating System:** Windows 10 or 11
* **Visual Studio:** 2022 (with **UWP** and **.NET** workloads)
* **Target Device:** HoloLens 2
* **Core Unity Packages:** This project utilizes the modern XR and UI components:
    * **Text Mesh Pro:** `com.unity.textmeshpro`
    * **XR Management:** `com.unity.xr.management`
    * **Unity OpenXR Plugin:** `com.unity.xr.openxr`
* **Key Packages (MRTK3 Modules):**
    * **MRTK Core:** `org.mixedrealitytoolkit.uxcore-4.0.0-pre.1`
    * **MRTK Input:** `org.mixedrealitytoolkit.input-4.0.0-pre.1` (Handles hand tracking and interaction)
    * **MRTK Spatial Manipulation:** `org.mixedrealitytoolkit.spatialmanipulation-4.0.0-pre.1` (For moving/scaling the dolphin)
    * **MRTK UX Components:** `org.mixedrealitytoolkit.uxcomponents-4.0.0-pre.1` (For UI elements)
    * **Microsoft OpenXR:** `com.microsoft.mixedreality.openxr-1.1.2` (Microsoft's recommended XR runtime)

---

## 🛠️ Simulator Tweak: Increase Hand Depth Speed

The default movement speed for the simulated Left and Right Hands when moving them closer or further (using **Shift** / **Space** + **Mouse Scroll**) is typically too slow. To correct this, you must **increase the Scale Factor** for the **Move Depth** action on both simulated hands:

1.  Open **MRTKInputSimulatorControls** (Input Actions Editor).
2.  For **both** `MRTK Sim: Left Hand` and `MRTK Sim: Right Hand`:
    * Expand **Move Depth**.
    * Select the `Binding: Scroll/Y [Mouse]`.
    * In **Binding Properties**, find the **Scale** processor and **increase the Factor** (e.g., set it to **$0.05$** or **$0.1$** instead of $0.001$).
3.  Click **Save Asset**.

---

## 📁 Project Info & Attribution
* **Asset Attribution:** See **[ATTRIBUTION.md](./Assets/Info/Attribute.md)** (Client, purchased, and third-party assets).
* **Project Specifications:** See **[Requirement.md](./Assets/Info/Requirement.md)** (Requirements by client and our analysis).


---

## 📜 License

© **AZMI STUDIO**. All Rights Reserved.

This software's source code is the **confidential property** of **AZMI STUDIO**. The client is granted a **Commercial Distribution License**, allowing them to sell and operate the final compiled application. **Access to the source code is restricted to the direct client only.** This license excludes all client-provided assets and third-party packages, which are licensed separately.