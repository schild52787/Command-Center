# Elle's Morning Routine Timer ⏰

A beautiful, ADHD-friendly morning routine timer app designed specifically for 6-year-old Elle. Built with React Native and Expo.

## 🌟 Features

### For Elle
- **Big START Button** - Easy to begin the routine independently
- **Clear Visual Progress** - Always shows what's happening RIGHT NOW
- **6 Fun Segments** - Each with its own emoji and timer
- **Gentle Sounds** - Encouraging chimes when each segment completes (no stressful beeps!)
- **Celebration & Rewards** - Stickers and stars when the routine is completed
- **Streak Tracker** - See how many days in a row completed (with fire emoji!)
- **Simple Controls** - Pause and restart anytime

### For Parents
- **Adjustable Timers** - Easily modify the duration of any segment
- **Persistent Settings** - Changes are saved automatically
- **Streak Tracking** - Automatic tracking of daily completion
- **Reset Option** - Restore default timings if needed

## 📱 The 6 Morning Routine Segments

1. 🚿 **Wake up → Bathroom** (5 minutes)
2. 👗 **Get dressed** (7 minutes)
3. 🥞 **Breakfast** (15 minutes)
4. 🪥 **Brush teeth** (3 minutes)
5. 🎒 **Pack backpack** (5 minutes)
6. 👟 **Shoes & coat** (3 minutes)

**Total Time:** 38 minutes

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- Expo Go app installed on your iPad/iPhone

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

   Or with Expo:
   ```bash
   npx expo start
   ```

3. **Open on Your iPad**
   - Open the **Expo Go** app on your iPad
   - Scan the QR code shown in the terminal
   - The app will load automatically!

### Installing Expo Go

If you don't have Expo Go yet:
- **iPad/iPhone**: Search for "Expo Go" in the App Store
- It's free and takes just a minute to install

## 📖 How to Use

### For Elle:
1. **Press the big START button** 🌟
2. **Watch the timer** - It shows how much time is left
3. **Listen for the gentle chime** - It means you finished that part!
4. **Keep going** - The app shows you what's next
5. **Get your reward** - Stars and celebration when you finish!

### For Parents:
1. **Tap the gear icon** ⚙️ (top left) to open settings
2. **Adjust any segment duration** using the + and - buttons
3. **Tap "Save Changes"** to apply
4. **View the streak badge** (top right) to see Elle's progress

## 🎨 ADHD-Friendly Design Features

- **Visual Hierarchy** - The current task is HUGE and impossible to miss
- **Color Coding** - Current (yellow), completed (green), upcoming (gray)
- **Constant Progress** - Always visible countdown and progress bar
- **Positive Reinforcement** - Celebrations, not nagging
- **Autonomy** - Elle controls when to start, pause, and restart
- **No Clutter** - Clean, simple interface with only essential information

## 🛠️ Troubleshooting

### App won't load on iPad?
- Make sure your iPad and computer are on the same WiFi network
- Try closing and reopening the Expo Go app
- Restart the development server with `npm start`

### Sounds not playing?
- Check that the iPad volume is turned up
- Make sure "Silent Mode" is off on the iPad
- Sounds use internet streaming - ensure you have a good connection

### Settings not saving?
- This shouldn't happen, but if it does, try:
  - Closing and reopening the app
  - Clearing the app data (shake device → "Reload")

## 📂 Project Structure

```
elle-morning-routine/
├── App.js                      # Main app component
├── src/
│   └── screens/
│       ├── TimerScreen.js      # Main timer interface
│       ├── RewardScreen.js     # Celebration screen
│       └── SettingsScreen.js   # Parent settings
├── assets/                     # Images and icons
├── app.json                    # Expo configuration
└── package.json               # Dependencies
```

## 🎯 Future Enhancement Ideas

Want to customize further? Here are some ideas:

- [ ] Add custom segment types
- [ ] Include photo/video instructions for each segment
- [ ] Add morning/evening mode toggle
- [ ] Include motivational voice recordings
- [ ] Add sibling mode (multiple profiles)
- [ ] Create achievement badges
- [ ] Export streak data to share with teachers

## 💝 Tips for Success

1. **Practice Together** - Walk through the app with Elle the first few times
2. **Celebrate Small Wins** - Even completing 1-2 segments is progress!
3. **Adjust as Needed** - The timings can be changed anytime in settings
4. **Be Consistent** - Use it every morning to build the habit
5. **Positive Framing** - Focus on what was completed, not what wasn't

## 📱 System Requirements

- **iOS**: 13.0 or later (works on iPad and iPhone)
- **Android**: 5.0 or later (if you want to use it on Android tablets)
- **Portrait Mode**: Optimized for iPad in portrait orientation

## 🆘 Support

If you run into any issues or have questions:
1. Check the troubleshooting section above
2. Review the Expo documentation: https://docs.expo.dev
3. Check that all dependencies are properly installed

## 📝 Notes

- **Data Storage**: Streak data and settings are stored locally on the device
- **Internet Required**: Only for initial load and gentle sounds
- **Privacy**: No data is sent to external servers
- **Offline Mode**: Timer works offline after initial load (sounds may not play)

## 🎉 Made with Love

This app was created to help Elle have successful, stress-free mornings. Every feature was designed with ADHD-inattentive needs in mind:
- Clear, unambiguous visuals
- Immediate feedback
- Positive reinforcement
- Child-controlled pacing
- Reduced cognitive load

---

**Have a wonderful morning routine, Elle! You've got this! 🌟**
