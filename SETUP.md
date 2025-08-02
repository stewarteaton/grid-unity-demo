# Power System File Parser Setup

This application uses OpenAI's GPT-4 to parse and analyze power system files in various formats (.raw, .dyr, .json, .csv).

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## Supported File Formats

- **.raw** - PSS/E format files defining buses, loads, branches, and base MVA
- **.dyr** - Dynamic parameter files for generators
- **.json** - Structured JSON data
- **.csv** - Tabular data files

## How It Works

1. **File Upload**: Users upload power system files through the web interface
2. **AI Parsing**: The file content is sent to OpenAI GPT-4 for intelligent parsing
3. **Format Detection**: The AI automatically detects the file format
4. **Data Extraction**: Key parameters are extracted:
   - Base power (MVA)
   - Buses (id, name, voltage, vm, va)
   - Loads (bus_id, mw, mvar)
   - Branches (from, to, r, x)
   - Generators (id, bus_id, type, base MVA, inertia)
5. **Analysis**: The AI provides system analysis and recommendations

## API Response Format

The API returns structured JSON with:

- `parsedData`: Extracted power system parameters
- `analysis`: AI-generated system analysis and recommendations
- `success`: Boolean indicating processing status

## Error Handling

The system includes robust error handling for:

- Missing API keys
- Invalid file formats
- OpenAI API errors
- Malformed responses

## Cost Considerations

- Each file processing uses OpenAI API tokens
- Estimated cost: ~$0.01-0.05 per file (depending on size)
- Monitor usage in your OpenAI dashboard
