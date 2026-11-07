# Education Short Video

可复用的代码驱动教学短片 skill：给 **subject + KLP（Key Learning Point）**，用 **deepseek-v4.1-flash** 导演并产出一支新的 **30–45 秒、1920×1080** 教学短片。这里保存方法、可改骨架和检查约定，**不是两支样片的复刻包**。

## 当前两支 skill

| 当课题需要… | 使用 | 文法 |
|---|---|---|
| 一个概念、一道推理、一次误解纠正 | [chalkboard](.agents/skills/chalkboard/SKILL.md) | 黑板、逐笔粉笔字、同色追踪、一次擦改；口播解释 |
| 空间中物体／人物的次序、分类、前后变化 | [isometric-picture-book](.agents/skills/isometric-picture-book/SKILL.md) | 全幅等距场景、三色纸感、地面字、动作表达规律 |

两个风格可以换学科、换 KLP、换场景；不得拿参考 demo 的故事、镜头表、对白、音乐或画面当新课件。

## 最短上手

```bash
# 在仓根，先选具体风格，完整读 SKILL.md 及其 references/。
python3 .agents/skills/chalkboard/scripts/new_project.py /path/to/new-film \
  --subject 'Grade 8 chemistry' --klp 'course-code-or-intent' \
  --goal '一句话可测的教学目标'

# 骨架只给确定性 render(t)、布局及音视频复用约定；未写教学几何，不能直接当课件交付。
# OpenCode 需要时使用 `-- 实际提示`，避免附件后的提示被误读为文件
# # Linux/macOS 只需要 Python 3 生成骨架，Node 跑轻量检查。
python3 /path/to/repo/tools/check_project.py --project /path/to/new-film
node /path/to/new-film/scripts/verify-project.mjs layout
# DeepSeek 应先写 TREATMENT，再实现该课题的 src/ + timeline.json，而不是照抄样例。
# 实际调用示例（先 `opencode models | grep -i 'deepseek.*flash'` 查可用 ID）：
opencode run --model <discovered-provider/deepseek-v4.1-flash-id> --format json \
  --file /path/to/repo/.agents/skills/chalkboard/SKILL.md -- \
  '读取 BRIEF 和完整 skill，写一个陌生 KLP 的新 TREATMENT；只规划，不假装已渲染。'
# 本版 OpenCode 需要 `--` 隔开 prompt，防止附件后的文本被误当文件。```

其余依赖是本地编辑／执行环境、浏览器截图工具或 Canvas／WebGL 渲染器、TTS（例如 `edge-tts`）及 `ffmpeg`。骨架只有浏览器标准 API 与 Node ESM，**不依赖 GSAP、私有渲染库或 TokenHub**。已有 [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) 的安装可作为可选引擎，但官方 Opus 调优不代表 OpenCode／DeepSeek 路径已经有同质量成片；按各自许可证保留声明。详见[制作管线](references/production-pipeline.md)。

## DeepSeek：真实可用，不绑服务商

- 本仓导演的规范模型名：`deepseek-v4.1-flash`；Kevin 所说的 `deepseek-4.1-flash` 作为用户别名保留。运行环境的 provider 可能加前缀，如 `opencode/deepseek-v4.1-flash-free`；先 `opencode models | grep -i deepseek`，按**实际发现的 ID**调用并把 ID／会话写入 `RUN.md`。
- TokenHub 只是可选 provider。可以使用 OpenCode 的一个运行实例，或 OpenAI-compatible API／shell；不需要 TokenHub 帐号。无发现的模型、鉴权或部署不成功，就明确停报，不静默换强大模型。
- CloudAgent **不得作主脑**。不冒称 Opus、不把文本规划或自动测试吹成 DeepSeek 全片验证。可用路径、模型别名记录及初始小探针见 [model-routing](references/model-routing.md)。

## 做新片

复制 [NEW-TOPIC-BRIEF](templates/NEW-TOPIC-BRIEF.md)，从官方／教师提供的 KLP 核实事实，写 `TREATMENT.md` 后再开画。教学主体、字号、安全区零重叠为硬约束。**约 10 秒一段 → 关键帧＋听 VO → COO「段过」→ 下一段 → 全片感官终审**，详见[10 秒门禁](standing-rules/teach-video-10s-gate.md)。自动检查是证据而不是验收 **PASS**；交 COO／人工门禁前不得宣称通过。

## 以后新增方法

仅当 **Kevin approval** 明确批准某方法后新增 `.agents/skills/<style>/`：独立 SKILL、文法与坑、必要工具及新 topic 验证；再更新本表与 `.agents/skills/README.md`。不从名字猜风格、不批量预生成未批准风格、不把样片 MP4／大图放进仓。具体扩展约定见 [AGENTS](AGENTS.md)。

## 范围与许可

当前 seed 提供方法、轻量骨架、结构检查和模型路径；没有收录原始样片或私有工作路径，也没有声称已用 DeepSeek 成功渲染完整新片。本机验证了非 TokenHub DeepSeek Flash 的短规划响应，以及两套非 DeepSeek 作者实现的 smoke 图形 `render(t)`（水分子／动物分类）与碰撞故障拒绝。**不是** STROKE/CJK 专家质量、完整文法出片或教育验收证据。每个 film 工作目录保存 `CREDITS`、来源、TTS／字体许可、真实运行日志及审核结论。仓内文档与自有代码为 [MIT](LICENSE)；上游方法／代码衍生说明见 [NOTICE](NOTICE.md)。原始样片不随仓分发。


## 九种风格已有动画（比较目录）

[打开九项视频、封面、SHA及状态目录](samples/README.md)。保留已有两个可复用skill，其余七个待补；样片审核与许可边界见目录说明。
