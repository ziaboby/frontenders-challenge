export default function initColorPalette(container, className) {
  const colors = [
    "#000000",
    "#808080",
    "#98AFC7",
    "#2B547E",
    "#151B54",
    "#00008B",
    "#0000FF",
    "#1E90FF",
    "#4682B4",
    "#00BFFF",
    "#87CEFA",
    "#00FFFF",
    "#16E2F5",
    "#66CDAA",
    "#40E0D0",
    "#20B2AA",
    "#008B8B",
    "#033E3E",
    "#1F6357",
    "#2E8B57",
    "#3CB371",
    "#556B2F",
    "#228B22",
    "#006400",
    "#004225",
    "#00FF00",
    "#7FFF00",
    "#E2F516",
    "#F0E68C",
    "#FFFF00",
    "#FFA500",
    "#F4A460",
    "#C19A6B",
    "#AA6C39",
    "#513B1C",
    "#7E3517",
    "#C04000",
    "#CD5C5C",
    "#E55B3C",
    "#FF0000",
    "#B22222",
    "#550A35",
    "#872657",
    "#E38AAE",
    "#DB7093",
    "#FF69B4",
    "#FF1493",
    "#C71585",
    "#FF00FF",
    "#F2A2E8",
    "#FFF",
  ];

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.style.backgroundColor = color;
    button.dataset.color = color;
    button.ariaLabel = button.title = `Select color ${color}`;
    container.append(button);
  });
}
