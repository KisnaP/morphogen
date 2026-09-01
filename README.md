# Morphogen

A browser-based reaction-diffusion pattern simulator built with vanilla JavaScript and HTML Canvas.

Morphogen simulates the Gray-Scott model — the same mathematical system that generates the patterns on animal skin. Two virtual chemicals (an activator and an inhibitor) interact across a grid, and the tension between them produces emergent biological patterns entirely from simple rules.

**[Live Demo](https://kisnap.github.io/morphogen)**

## Patterns

- **Coral** — winding labyrinthine structures
- **Cheetah** — isolated spots, analogous to big cat skin patterns
- **Mitosis** — spots that slowly divide, mimicking cell division
- **Fingerprint** — dense whorls and ridges
- **Dendrites** — branching crystalline growth

## Controls

- **Feed** — rate at which chemical A is replenished
- **Kill** — rate at which chemical B is removed
- **Speed** — simulation steps per frame
- **Reset** — restore default parameters and reseed
- **Clear** — wipe the canvas and seed from a single point

## How it works

The simulation solves the Gray-Scott partial differential equations at every pixel on a 600×600 grid, running entirely in the browser with no backend. Pattern type is determined by the feed/kill parameter space — small changes produce dramatically different emergent behaviour.

This model was originally proposed by Alan Turing in 1952 to explain how biological patterns self-organise during embryonic development.

## Tech

- Vanilla JavaScript
- HTML Canvas API
- Typed arrays (Float32Array) for performance
- Deployed via GitHub Pages
