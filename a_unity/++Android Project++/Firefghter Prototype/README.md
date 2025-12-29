# 👨‍🚒 Firefighter Prototype [TPS/FPS] [Android/PC]

This mobile project is a high-performance simulation designed to teach fire safety and how to use an extinguisher. By offering both First-Person (FPS) and Third-Person (TPS) modes, the gameplay provides a realistic way to practice putting out fires. It serves as an easy-to-use tool for learning life-saving skills through interactive action.

Built for mobile efficiency, this prototype features a smooth camera system and optimized physics to save battery and CPU power. The seamless switch between FPS and TPS modes allows for precise aiming and better awareness of the surroundings. With realistic fire effects and smart performance, this simulation offers a high-quality training experience that runs perfectly on Android.

---

## 🔗 Quick Links

| [Github](https://github.com/sabbirahmedsr/firefighter-prototype) | [Gitlab](https://gitlab.com/sabbirahmedsr/firefighter-prototype) | [Info](./Assets/Info) | [Portfolio](https://sabbirahmedsr.github.io/portfolio/#/project/firefighter-prototype) |
| :---: | :---: | :---: | :---: |

---
## 📅 Project Timeline & Status

| Proposal Discussion | Project Start | Project Completion | Duration |
| :---: | :---: | :---: | :---: |
| December 14, 2025 | **December 16, 2025** | December 22, 2025 | 1 Week |

---

## 🚀 Key Features
A high-performance, event-driven firefighting simulation developed for Android. This project focuses on efficient physics, optimized particle systems, and a lean UI/UX flow.
* **Optimized Physics:** Throttled raycasting for the fire extinguisher (10Hz) to save CPU cycles on mobile.
* **Event-Driven Audio:** Global fire soundscapes that dynamically scale volume based on total remaining fire health without using `Update()` loops.
* **Lean Cutscene Manager:** Uses Camera Culling Masks and Depth layers to handle transitions without the overhead of enabling/disabling complex player hierarchies.
* **Visual Feedback:** Intelligent particle scaling that ensures a "visual floor," so players always have a target until the fire is 100% extinguished.
* **Android Ready:** Built with mobile-friendly UI components and memory-efficient audio handling (`PlayOneShot`).

---

## 🛠️ Technical Details

* Engine: **Unity 6000.2.8f1**
* Render Pipeline: **URP** [Universal Render Pipeline]
* Language: C#
* Platform: Android, IOS, PC

### ⚙️ **Packages & Dependencies**
The following specific versions were used to ensure stability and performance on mobile:

| Package Name | Version | Description |
| :--- | :--- | :--- |
| `Universal RP` | 17.2.0 | High-performance graphics pipeline for mobile. |
| `Input System` | 1.14.2 | Advanced cross-platform input handling. |
| `Burst Compiler` | 1.8.25 | LLVM-based backend for highly optimized C# code. |
| `Unity Mathematics` | 1.3.2 | SIMD-friendly math for physics and performance. |
| `Timeline` | 1.8.9 | Narrative and cinematic sequencing tools. |
| `TextMeshPro` | 3.0.9 | High-fidelity SDF text rendering. |
| `Unity Collections` | 2.5.7 | Native memory management for high-speed logic. |

---

## 📖 How to Play
1. Watch the introductory cinematic.
2. Once gameplay begins, navigate the environment to find fire sources.
3. Hold the **Spray** button to extinguish flames.
4. Extinguish all fires to achieve **Mission Accomplished**.

---

## 🏷️ Attribution

* **Environment:** [Bedrooms Bathroom Interior](https://assetstore.unity.com/packages/3d/props/interior/bedrooms-bathroom-interior-low-poly-assets-311111) (Fries and Seagull), [Low Poly Kitchen Set](https://assetstore.unity.com/packages/3d/props/interior/low-poly-kitchen-set-303227) (HunterCraft Creations), [Free: House Interior](https://assetstore.unity.com/packages/3d/props/interior/free-house-interior-223416) (Studio Billion).
* **Characters & Input:** [City People FREE Samples](https://assetstore.unity.com/packages/3d/characters/city-people-free-samples-260446) (Denys Almaral), [Joystick Pack](https://assetstore.unity.com/packages/tools/input-management/joystick-pack-107631) (Fenerax Studios).
* **Visuals:** [VFX URP - Fire Package](https://assetstore.unity.com/packages/vfx/particles/fire-explosions/vfx-urp-fire-package-305098) (Wallcoeur), [PixPal Palette](https://payhip.com/b/8KOlD) (Imphenzia).
* **Media:** [Moon Video](https://pixabay.com/videos/moon-satellite-space-astronomy-208577/) (olenchic via Pixabay).

*Full details can be found in the [Attribution File](./Assets/Info/Attribute.md).*

---
*This README.md and the core architectural logic of this project were assisted and documented by AI.*








