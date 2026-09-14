import json

with open('/Users/shafayat/.gemini/antigravity-ide/brain/a626a6a8-ba68-463a-9272-36155dd2a460/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        if 'write_to_file' in line and 'poemLines' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') == 'write_to_file':
                            code = call.get('args', {}).get('CodeContent', '')
                            if 'poemLines' in code:
                                with open('scratch/recovered_rich_data.js', 'w') as out:
                                    out.write(code)
                                print("Found something with poemLines!")
            except:
                pass
print("Done")
