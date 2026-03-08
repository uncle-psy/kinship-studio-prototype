export default function PlatformSettingsPage() {
  const settings = [
    { label: "Platform Name", value: "sample-platform" },
    { label: "Slug", value: "sample-platform" },
    { label: "Description", value: "—" },
    { label: "Icon", value: "🎮", isIcon: true },
    { label: "Color", value: "#4CADA8", isColor: true },
    { label: "Total Assets", value: "63" },
    { label: "Total Games", value: "1" },
    { label: "HEARTS Framework", value: "7 facets enabled" },
    { label: "Platform ID", value: "0a061698-f710-4e2f-901f-32f7f92..." },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-muted mt-1">Configuration for sample-platform</p>
      </div>

      {/* Settings table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden mb-8">
        {settings.map((setting, i) => (
          <div
            key={setting.label}
            className={`flex items-center justify-between px-6 py-4 ${
              i < settings.length - 1 ? "border-b border-card-border" : ""
            }`}
          >
            <span className="text-foreground/80">{setting.label}</span>
            <div className="flex items-center gap-2">
              {setting.isColor && (
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: setting.value }}
                />
              )}
              <span className="text-white font-medium">{setting.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/30 rounded-xl p-6">
        <h3 className="text-red-400 font-semibold text-lg mb-2">Danger Zone</h3>
        <p className="text-muted text-sm mb-4">
          Deleting a platform will remove all its assets, knowledge, and games. This action cannot be undone.
        </p>
        <button className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-medium px-4 py-2 rounded-lg transition-colors">
          Delete Platform
        </button>
      </div>
    </div>
  );
}
