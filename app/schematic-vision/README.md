# Schematic Vision - Single-Line Diagram Analyzer

This feature allows users to upload images of single-line diagrams (SLD) and extract structured data using OpenAI's vision capabilities.

## Features

- **Image Upload**: Drag and drop or click to upload image files (JPG, PNG, GIF)
- **File Validation**: Automatic validation of file type and size (max 10MB)
- **AI Analysis**: Uses OpenAI GPT-4o with vision to analyze electrical schematics
- **Structured Output**: Returns JSON data with extracted electrical system information
- **Progress Tracking**: Real-time progress indicators during analysis
- **Error Handling**: Comprehensive error handling and user feedback

## How It Works

1. **Upload Image**: Users can drag and drop or select an image file containing a single-line diagram
2. **Image Processing**: The image is converted to base64 and sent to the OpenAI API
3. **AI Analysis**: OpenAI's GPT-4o model analyzes the image using a specialized prompt for electrical systems
4. **Data Extraction**: The AI extracts structured information about:
   - System overview (buses, voltage levels, system type)
   - Electrical components (generators, transformers, loads, breakers)
   - Connections and topology
   - System data (ratings, frequencies, etc.)
5. **Results Display**: The extracted data is displayed in a formatted JSON view

## API Endpoint

The feature uses the `/api/process-schematic` endpoint which:

- Accepts POST requests with image data
- Uses OpenAI's GPT-4o model with vision capabilities
- Returns structured JSON data
- Handles errors gracefully

## Environment Variables

Required environment variable:

- `OPENAI_API_KEY`: Your OpenAI API key for accessing the vision model

## Component Structure

```
schematic-vision/
├── page.tsx                 # Main page component
├── hooks/
│   ├── useLogic.ts         # State management and business logic
│   └── useConnect.ts       # API communication
├── components/
│   ├── ImageUploadArea.tsx # Drag & drop upload area
│   ├── SelectedImageDisplay.tsx # Selected file info
│   ├── ImagePreview.tsx    # Image preview
│   ├── ProcessButton.tsx   # Analysis trigger button
│   ├── LoadingSteps.tsx    # Progress indicators
│   ├── ResultsDisplay.tsx  # Results presentation
│   ├── EmptyResultsPlaceholder.tsx # Empty state
│   └── index.ts           # Component exports
└── README.md              # This file
```

## Usage

1. Navigate to the "Schematic Vision" tab
2. Upload an image of a single-line diagram
3. Click "Analyze Schematic" to start the AI analysis
4. View the extracted data in the results section

## Supported Image Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- Maximum file size: 10MB

## Expected Output

The AI analysis returns structured JSON data including:

```json
{
  "system_overview": {
    "total_buses": 5,
    "voltage_levels": ["138kV", "69kV", "13.8kV"],
    "system_type": "radial"
  },
  "components": {
    "generators": [...],
    "transformers": [...],
    "loads": [...],
    "breakers": [...]
  },
  "connections": [...],
  "system_data": {
    "base_mva": 100,
    "frequency": 60
  },
  "topology": {...}
}
```

## Error Handling

The feature includes comprehensive error handling for:

- Invalid file types
- File size limits
- API failures
- Network issues
- OpenAI service errors

## Security

- File type validation prevents malicious uploads
- File size limits prevent abuse
- API key is stored securely in environment variables
- No sensitive data is logged or stored
