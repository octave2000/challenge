import React from 'react';

const controlPanelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '250px',
  background: 'rgba(40, 40, 40, 0.8)',
  borderRadius: '8px',
  padding: '15px',
  color: 'white',
  fontFamily: 'sans-serif',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const controlGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
};

const selectStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #555',
  background: '#333',
  color: 'white',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #555',
  background: '#333',
  color: 'white',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    background: '#555',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
};

interface ControlsProps {
  tubeType: 'rectangular' | 'square';
  setTubeType: (type: 'rectangular' | 'square') => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
  length: number;
  setLength: (length: number) => void;
  thickness: number;
  setThickness: (thickness: number) => void;
  wireframe: boolean;
  setWireframe: (wireframe: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  tubeType,
  setTubeType,
  width,
  setWidth,
  height,
  setHeight,
  length,
  setLength,
  thickness,
  setThickness,
  wireframe,
  setWireframe,
}) => {
  const handleTubeTypeChange = (type: 'rectangular' | 'square') => {
    setTubeType(type);
    if (type === 'square') {
      setHeight(width);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (tubeType === 'square') {
      setHeight(newWidth);
    }
  };

  return (
    <div style={controlPanelStyle}>
      <div style={controlGroupStyle}>
        <label style={labelStyle}>Tube Type</label>
        <select
          style={selectStyle}
          value={tubeType}
          onChange={(e) => handleTubeTypeChange(e.target.value as 'rectangular' | 'square')}
        >
          <option value="rectangular">Rectangular</option>
          <option value="square">Square</option>
        </select>
      </div>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Width</label>
        <input
          style={inputStyle}
          type="number"
          value={width}
          onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
          step="0.1"
        />
      </div>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Height</label>
        <input
          style={inputStyle}
          type="number"
          value={height}
          onChange={(e) => setHeight(parseFloat(e.target.value))}
          step="0.1"
          disabled={tubeType === 'square'}
        />
      </div>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Length</label>
        <input
          style={inputStyle}
          type="number"
          value={length}
          onChange={(e) => setLength(parseFloat(e.target.value))}
          step="0.1"
        />
      </div>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Thickness</label>
        <input
          style={inputStyle}
          type="number"
          value={thickness}
          onChange={(e) => setThickness(parseFloat(e.target.value))}
          step="0.05"
        />
      </div>
      <button style={buttonStyle} onClick={() => setWireframe(!wireframe)}>
        Toggle Wireframe
      </button>
    </div>
  );
};

export default Controls;