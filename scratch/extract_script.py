import json

with open('/Users/shafayat/.gemini/antigravity-ide/brain/a626a6a8-ba68-463a-9272-36155dd2a460/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        if 'inject_context.cjs' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') == 'write_to_file' and 'inject_context.cjs' in call.get('args', {}).get('TargetFile', ''):
                            code = call['args']['CodeContent']
                            with open('scratch/recovered_inject_context.cjs', 'w') as out:
                                out.write(code)
                            print("Successfully recovered inject_context.cjs!")
                            exit(0)
            except Exception as e:
                pass
print("Could not find it.")
