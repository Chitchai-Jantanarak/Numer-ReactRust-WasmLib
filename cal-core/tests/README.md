# Testing Description

This directory contains **UNIT TEST** for each mod in each functionalities that be used on web pages *ONLY*

These testing file structure is be named as `src>...` that library has

## Test Philosophy

These tests **was** :

- Confirm core algorithm logic
- Output structure and value flow
- Use `stdout` <ostream> on console to trace iterations & values
- Are organized by **concept**, not for utilities function to be used in export functions

These tests **not include**:

- Fuzz inputs or types verifications
- Assertion value => floating-point precision, answers unexpected
- Panic safety
- Numeric overflow, underflow
- Data structure outbound, data leaks