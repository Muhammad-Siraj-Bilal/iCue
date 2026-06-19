# iCue – AI-Powered Billiards Coaching and Motion Analytics System

iCue is an AI-assisted billiards training system that combines wearable inertial motion sensing, real-time performance analytics, and generative AI coaching.

The system uses an ESP32-based wearable sensor attached to a cue stick to capture movement data during a shot. Motion metrics are processed through a rule-based scoring system and presented through a companion application, where players can review their performance, track progress, and receive personalised natural-language coaching recommendations.

iCue was developed as a final-year Computer Systems Engineering project at Middlesex University Dubai and later formed the basis of a peer-reviewed IEEE conference paper.

## Research Publication

The research behind iCue was published at the **2025 IEEE International Smart Cities Conference (ISC2)**.

### Paper Title

**An AI-Assisted Educational Framework for Physical Skill Acquisition via Inertial Motion Sensing and Generative Learning Models**

### Authors

* Muhammad Siraj Bilal
* Dr. Judhi Prasetyo

### Publication Links

* [Read the paper on IEEE Xplore](https://ieeexplore.ieee.org/document/11293333)
* [View the complete iCue development journey](https://muhammadsirajbilal.wixstudio.com/gradprojectjourney)

### DOI

```text
10.1109/ISC266238.2025.11293333
```

## Project Journey

The complete development journey of iCue was documented through a dedicated project website.

The website includes:

* Weekly development updates
* Supervisor meeting logs
* Design decisions
* Prototype testing
* Hardware development
* Application development
* Project documents
* Demonstration media
* Reflections and lessons learned

Visit the project blog:

[Bilal's iCue Development Journey](https://muhammadsirajbilal.wixstudio.com/gradprojectjourney)

## Problem Statement

Billiards is a precision-based sport that requires consistency, controlled cue movement, accurate alignment, and steady execution.

Professional players may have access to experienced coaches and specialist training systems. Casual and amateur players, however, often depend on subjective self-assessment and may not receive immediate, objective, or personalised feedback.

Existing billiards technologies commonly focus on:

* Game scoring
* Ball tracking
* Table projection
* Shot simulation
* Expensive professional training equipment

iCue addresses this gap by analysing the physical movement of the cue stick and converting motion data into understandable coaching feedback.

## Proposed Solution

iCue provides an accessible training framework consisting of:

* A wearable ESP32-based motion-sensing device
* An inertial measurement unit attached to the cue stick
* Real-time movement-data collection
* Rule-based performance scoring
* Shot-history tracking
* Data visualisation
* A generative AI coaching assistant
* Personalised improvement recommendations

The approach combines objective sensor measurements with understandable natural-language guidance.

## Key Features

* Real-time cue-stick motion sensing
* Wearable ESP32-based hardware
* Inertial measurement and movement analysis
* Objective shot-performance scoring
* Cue stability and consistency assessment
* Shot-session history
* Performance visualisation
* Personalised AI coaching feedback
* Context-aware training recommendations
* Low-cost and portable system design
* Companion application
* Support for amateur and developing players
* Hybrid rule-based and generative AI architecture

## Research Contribution

The main research contribution of iCue is a hybrid AI-assisted educational framework for physical-skill acquisition.

The framework combines two feedback layers:

### Rule-Based Analytics Layer

The rule-based layer processes motion measurements and produces objective performance metrics.

This layer is designed to evaluate characteristics such as:

* Cue movement consistency
* Stability
* Motion variation
* Shot control
* Repeated-shot performance
* Deviation from expected movement patterns

### Generative AI Coaching Layer

The generative AI layer receives:

* Calculated performance metrics
* Shot context
* User performance history
* Identified strengths
* Identified areas for improvement

It converts the numerical results into personalised and understandable coaching guidance.

This hybrid approach allows the system to retain objective scoring while producing feedback that feels more natural and useful to the player.

## System Architecture

```text
Cue Stick Movement
        │
        ▼
ESP32-Based Inertial Sensor
        │
        ▼
Motion Data Collection
        │
        ▼
Data Transmission
        │
        ▼
Companion Application
        │
        ├── Rule-Based Motion Scoring
        │
        ├── Performance Metrics
        │
        ├── Session History
        │
        └── Data Visualisation
        │
        ▼
Generative AI Coaching Layer
        │
        ▼
Personalised Feedback and Recommendations
```

## How iCue Works

### 1. Sensor Placement

The compact sensing device is attached to the billiards cue.

Its inertial sensor measures movement during the player's shot.

### 2. Motion Capture

As the player performs a shot, the ESP32 records motion-related data from the inertial measurement unit.

The captured measurements represent the physical movement and stability of the cue.

### 3. Data Transmission

The sensor data is transmitted to the companion application for processing and analysis.

### 4. Rule-Based Scoring

The application calculates objective metrics from the recorded motion data.

These metrics are used to assess shot consistency and identify movement patterns that may affect performance.

### 5. Performance Visualisation

The user can review:

* Shot metrics
* Performance scores
* Historical sessions
* Trends
* Areas of consistency
* Areas requiring improvement

### 6. AI-Assisted Coaching

The calculated metrics and shot context are passed to a generative language model.

The AI assistant converts the data into:

* Simple performance explanations
* Personalised recommendations
* Suggested areas of focus
* Actionable practice guidance
* Encouragement based on performance

## Feedback Pipeline

```text
Raw IMU Measurements
        ↓
Data Cleaning and Processing
        ↓
Motion Feature Extraction
        ↓
Rule-Based Evaluation
        ↓
Performance Score
        ↓
Shot Context and Historical Data
        ↓
Generative AI Model
        ↓
Natural-Language Coaching Feedback
```

## Research Evaluation

The iCue framework was evaluated with amateur billiards players to assess usability, responsiveness, and the perceived usefulness of its coaching feedback.

| Evaluation Metric           |             Result |
| --------------------------- | -----------------: |
| Participants                | 25 amateur players |
| System Usability Scale      |             91/100 |
| Feedback latency            |    Under 2 seconds |
| Perceived feedback accuracy |           Over 90% |

An experienced billiards coach also reviewed a subset of recorded sessions to assess whether the system's feedback was plausible and relevant.

These results demonstrate the feasibility of combining low-cost inertial sensing with generative AI for physical-skill coaching.

## Technologies and Concepts

### Embedded Hardware

* ESP32
* Inertial measurement unit
* Wearable sensing
* Embedded C/C++
* Motion-data acquisition
* Wireless communication

### Application and Analytics

* Companion application
* Data visualisation
* Performance-history tracking
* Rule-based scoring
* Motion analytics
* Session management

### Artificial Intelligence

* Generative AI
* Generative language models
* GPT-series coaching assistant
* Prompt engineering
* Context-aware recommendations
* Natural-language feedback

### Research and Evaluation

* User-centred design
* System Usability Scale
* Quantitative evaluation
* Qualitative coach review
* Physical-skill acquisition
* Human–AI interaction
* Smart education

## Repository Structure

The repository currently contains:

```text
iCue/
│
├── app-ship-main
├── iCueHardwareCode.zip
└── README.md
```

| Item                   | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `app-ship-main`        | Git subproject reference for the companion application |
| `iCueHardwareCode.zip` | Compressed ESP32 and sensor-related hardware code      |
| `README.md`            | Main project documentation                             |

## Important Repository Note

The current `app-ship-main` entry is stored as a Git subproject reference, but the repository does not currently provide a working submodule configuration.

To make the project easier to clone and run:

* Add the complete application source code directly to the repository, or
* Configure a valid Git submodule
* Add a `.gitmodules` file
* Replace the compressed hardware archive with a normal source-code folder
* Add environment-variable templates
* Add hardware wiring diagrams
* Add application screenshots
* Restore or update the deployed demonstration link

A recommended structure would be:

```text
icue-ai-billiards-coach/
│
├── app/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── firmware/
│   ├── icue_sensor/
│   │   └── icue_sensor.ino
│   └── README.md
│
├── hardware/
│   ├── wiring-diagram.png
│   ├── enclosure/
│   └── bill-of-materials.md
│
├── research/
│   ├── citation.bib
│   └── evaluation-summary.md
│
├── screenshots/
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Hardware Requirements

The exact components may depend on the prototype version.

The core system requires:

* ESP32 development board
* Compatible inertial measurement unit
* Cue-stick mounting mechanism
* USB cable
* Suitable power source
* Smartphone, tablet, or computer
* Wireless network or compatible device connection

## Software Requirements

Depending on the application version, development may require:

* Arduino IDE or PlatformIO
* ESP32 board support
* Application runtime and package manager
* Generative AI API access
* Cloud or database configuration
* Modern web browser or compatible mobile device

## Hardware Setup

### 1. Download the Repository

```bash
git clone https://github.com/Muhammad-Siraj-Bilal/iCue.git
cd iCue
```

### 2. Extract the Hardware Code

Extract:

```text
iCueHardwareCode.zip
```

Move the extracted code into a dedicated firmware directory where possible:

```text
firmware/icue_sensor/
```

### 3. Open the Firmware

Open the main firmware file using Arduino IDE or PlatformIO.

### 4. Install ESP32 Support

In Arduino IDE:

```text
Tools → Board → Boards Manager
```

Search for and install the ESP32 board package.

### 5. Configure the Hardware

Review and update:

* IMU communication pins
* I²C configuration
* Network settings
* Data-transmission settings
* Sensor calibration values
* Sampling frequency

### 6. Select the Board and Port

```text
Tools → Board → Select the ESP32 board
Tools → Port → Select the connected port
```

### 7. Upload the Firmware

Compile and upload the firmware to the ESP32.

## Sensor Calibration

Inertial sensors should be calibrated before collecting shot data.

A basic calibration process should include:

1. Place the cue and sensing device in a stable position.
2. Keep the sensor motionless during initialisation.
3. Record baseline accelerometer and gyroscope values.
4. Calculate offsets.
5. Apply the offsets during data processing.
6. Test multiple controlled cue movements.
7. Confirm that repeated movements produce consistent readings.

Calibration quality directly affects the reliability of the generated performance metrics.

## Application Setup

The application source must first be restored from the current Git subproject or added directly to the repository.

After restoring the application:

### 1. Open the Application Directory

```bash
cd app
```

### 2. Install Dependencies

For a JavaScript-based application:

```bash
npm install
```

### 3. Create an Environment File

Create:

```text
.env
```

Example configuration:

```env
AI_API_KEY=your_api_key
DATABASE_URL=your_database_url
SENSOR_API_URL=your_sensor_api_url
```

Do not commit real API keys or credentials.

### 4. Run the Application

```bash
npm run dev
```

Use the commands defined in the application's package configuration if they differ.

## Using iCue

1. Attach the iCue sensor securely to the billiards cue.
2. Power on the ESP32.
3. Open the companion application.
4. Connect the sensing device.
5. Start a training session.
6. Perform a billiards shot.
7. Allow the system to process the motion data.
8. Review the calculated performance metrics.
9. Read the AI-generated coaching feedback.
10. Repeat the exercise and compare results over time.

## Example Feedback

A typical feedback response may explain:

```text
Your cue movement remained stable during most of the shot, but the motion
became less consistent near the point of contact. Try slowing the final
forward movement and keeping your grip relaxed to improve straightness.
```

The final feedback depends on the measured motion metrics, shot context, and previous performance.

## Applications Beyond Billiards

Although iCue was implemented for cue sports, the framework can be adapted to other physical-skill learning areas.

Potential applications include:

* Tennis-stroke analysis
* Golf-swing coaching
* Badminton training
* Baseball batting
* Rehabilitation exercises
* Physiotherapy
* Workplace ergonomics
* Motor-skill education
* Robotics-assisted training

The main framework remains:

```text
Motion Sensing
      +
Objective Scoring
      +
Generative AI Feedback
      =
Personalised Physical-Skill Coaching
```

## Research Limitations

The published study identifies several limitations:

* Relatively small evaluation dataset
* Dependence on network connectivity
* Evaluation focused mainly on amateur players
* Need for broader expert validation
* Potential variation between individual playing styles
* Sensor-placement sensitivity
* Need for longer-term performance studies

The system should be treated as an assistive coaching tool rather than a replacement for an experienced human coach.

## Responsible AI Considerations

iCue is designed to support learning rather than make absolute judgments about a player's ability.

Responsible use should include:

* Clearly explaining how performance scores are calculated
* Distinguishing measured data from AI-generated interpretation
* Protecting user and session data
* Avoiding unsupported medical or injury-related claims
* Allowing users to question or ignore recommendations
* Validating advice with qualified coaches
* Monitoring the quality and consistency of AI feedback

## Recommended Improvements

* Restore the complete application source code
* Replace the broken Git subproject with a valid folder or submodule
* Extract the hardware code into readable source files
* Restore the deployed application
* Add automatic Bluetooth or Wi-Fi device discovery
* Add guided sensor calibration
* Add live cue-motion graphs
* Add shot-comparison visualisation
* Add user accounts and secure authentication
* Add configurable coaching levels
* Add offline scoring
* Add multilingual AI feedback
* Add coach and player dashboards
* Expand the participant dataset
* Conduct long-term training studies
* Compare results with professional coaching assessments
* Add explainable scoring indicators
* Add automated firmware tests
* Add application tests
* Add project screenshots and a demonstration video
* Add a hardware bill of materials
* Add enclosure design files
* Add a proper open-source licence

## Citation

When using or referencing this project, please cite:

```bibtex
@INPROCEEDINGS{11293333,
  author={Bilal, Muhammad Siraj and Prasetyo, Judhi},
  booktitle={2025 IEEE International Smart Cities Conference (ISC2)},
  title={An AI-Assisted Educational Framework for Physical Skill Acquisition via Inertial Motion Sensing and Generative Learning Models},
  year={2025},
  doi={10.1109/ISC266238.2025.11293333}
}
```

## Awards and Recognition

iCue has been presented as an academic, engineering, and AI innovation project.

Relevant achievements and milestones can be added here, including:

* Research publication in IEEE conference proceedings
* University research competitions
* AI innovation competitions
* Project exhibitions
* Technical demonstrations
* Academic showcases

## Suggested GitHub Topics

```text
icue
billiards
cue-sports
artificial-intelligence
generative-ai
esp32
imu
inertial-sensor
motion-analysis
wearable-technology
sports-analytics
ai-coaching
physical-skill-learning
embedded-systems
smart-education
human-ai-interaction
gpt
iot
```

## Author

**Muhammad Siraj Bilal**

Computer Systems Engineering graduate, AI researcher, robotics developer, and creator of iCue.

## Research Supervisor

**Dr. Judhi Prasetyo**

Middlesex University Dubai

## Project Links

* [GitHub Repository](https://github.com/Muhammad-Siraj-Bilal/iCue)
* [IEEE Research Paper](https://ieeexplore.ieee.org/document/11293333)
* [Development Journey and Project Blog](https://muhammadsirajbilal.wixstudio.com/gradprojectjourney)

## Disclaimer

iCue is an educational and research prototype.

The feedback generated by the system is intended to assist players with training and self-reflection. It should not be treated as a guaranteed assessment of sporting ability or as a substitute for professional coaching.

## Licence

No open-source licence is currently specified.

Add a `LICENSE` file before allowing reuse, redistribution, or external contributions.
