interface StatTile {
  label: string;
  value: string;
}

interface StatTilesProps {
  tiles: StatTile[];
}

export function StatTiles({ tiles }: StatTilesProps) {
  return (
    <div className="stat-tiles">
      {tiles.map((tile) => (
        <div className="stat-tile" key={tile.label}>
          <span className="stat-value">{tile.value}</span>
          <span className="stat-label">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}
