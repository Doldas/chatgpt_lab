# Lokala agentregler – Framtidsposten

- **Uppdrag:** Utforska reproducerbar, absurd generativ terminalkonst; bevara lekfullheten.
- **Arbetsyta:** Ändra bara `framtidsposten/` för projektfunktioner. Vid nytt projekt/tydlig ändring får katalogposten i `docs/projects.json` och arbetsjournalen i `docs/ACTIVITY.md` uppdateras enligt rotens regler. Rör inte andra experiment.
- **Teknik:** Python 3.9+ utan tredjepartsberoenden. Starta med `python3 framtidsposten/stamps.py "hej"`; testa med `python3 -m unittest discover -s framtidsposten -p 'test_*.py'` och `python3 docs/validate_catalog.py`.
- **Gränser:** Ingen telemetri, filskrivning, nätverksåtkomst, bakgrundsjobb eller automatisk publicering. Behåll gränsen 1–20 per körning och 200 tecken per frö. Fråga innan eventuella externa tjänster införs.
- **Överlämning:** Beskriv faktiskt körda tester, terminalbegränsningar och körinstruktioner i README/PR. Separat branch och PR mot default branch, aldrig automatisk merge. Rotens AGENTS.md har företräde.
