import json

with open('/Users/shafayat/.gemini/antigravity-ide/brain/a626a6a8-ba68-463a-9272-36155dd2a460/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        if 'src/data/chapters.json' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') == 'write_to_file' and 'src/data/chapters.json' in call.get('args', {}).get('TargetFile', ''):
                            code = call['args']['CodeContent']
                            # Let's save the last largest write to chapters.json
                            with open('scratch/recovered_chapters_json_raw.json', 'w') as out:
                                out.write(code)
            except Exception as e:
                pass
print("Finished searching for chapters.json.")
