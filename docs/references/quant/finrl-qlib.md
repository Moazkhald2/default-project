# Quant References — Parked for adaptive difficulty (Phase 3)

> Deep analysis x.com/DivyanshT91162/status/2093456774875791460 — not installed, reference only.

## FinRL (16k, AI4Finance-Foundation/FinRL)
- DRL framework (A2C/DDPG/PPO/SAC/TD3), Gym envs, 14 processors, educational 3-layer monolith.
- Superseded by `FinRL-X` (`FinRL-Trading`). Use for RL adaptive worksheet sequencing later.
- Install later: `pip install -e .` in `finrl/`.

## Qlib (48k, `microsoft/qlib`)
- Microsoft quant platform, full pipeline: `qrun benchmarks/LightGBM/workflow_config_lightgbm_Alpha158.yaml`.
- Data: `python -m qlib.cli.data qlib_data --target_dir ~/.qlib/cn_data --region cn` or `chenditc/investment_data` tarball.
- Models: Alpha360/158 + zoo (XGBoost/LightGBM/HIST/TRA/Transformer).
- Install: `pip install pyqlib`.

## TradingAgents (102k, `TauricResearch/TradingAgents`)
- Multi-agent LLM trading firm (Analyst->Researcher->Trader->Risk), LangGraph + checkpoint resume `~/.tradingagents/cache/checkpoints/<TICKER>.db`.
- Pattern to steal: `decision log` `trading_memory.md` -> future `math_memory.md` for problem solving reflections.

## When to activate
- Phase 3 only: RL difficulty adapter needs stable Phase 0 flowcharts + Phase 2 graph.
