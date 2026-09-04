# 截屏王：本地 AI 与图像处理技术方案

> 记录日期：2026-09-04  
> 适用范围：截屏王 / Apowersoft Screenshot 的 iOS、iPadOS 产品设计与后续原生开发  
> 目标：优先离线处理、保护隐私、控制包体和内存，并把技术能力转化为用户能理解且愿意付费的功能。

## 0. 版本范围与延期项

### 第一版

- 不提供 Mac 互传；
- 首页顶部仅保留产品名称和设置入口；
- 优先完成长截图、智能打码、文档扫描、截图净化和图片标注等本机处理体验。

### 下个版本

Mac 互传列入下个版本规划，待第一版核心图片处理流程稳定后再设计和开发。计划用于 iPhone、iPad 与 Mac 之间传输截图、长图和导出结果；具体连接方式、传输范围与首页入口位置在下个版本评审时确定。

## 1. 核心结论

不建议把产品做成“模型工具箱”，也不建议为了 AI 标签集成多个大模型。更适合本产品的技术分层是：

```text
Vision / VisionKit       识别、理解、系统级交互
OpenCV                   拼接、配准、几何检测、差异计算
Core Image / vImage      图像渲染、滤镜、缩放、大图处理
Metal / MPS              GPU 加速与编辑器实时预览
Core ML                  运行少量系统能力无法覆盖的本地模型
Create ML                训练自有截图场景分类器
Translation              OCR 后的本地翻译
Foundation Models        OCR 文本总结、分类、标签和结构化输出
```

推荐基础组合：

```text
Vision + VisionKit
OpenCV
Core Image + vImage
Core ML 自有截图分类器
可选下载 Real-ESRGAN / MODNet
```

## 2. 原生技术能力与职责

### 2.1 Vision

适合承担：

- 多语言 OCR；
- 人脸、文字区域、条码和二维码检测；
- 文档结构识别；
- 人物和前景实例分割；
- 图片质量判断；
- Feature Print 图片相似度计算；
- 图片平移、透视配准；
- 调用自定义 Core ML 模型。

在本产品中的应用：智能打码、图片转文字、相似截图清理、长截图预分组、图片对比、证件照抠图。

参考：

- [Apple Vision](https://developer.apple.com/documentation/vision)
- [Recognizing Text in Images](https://developer.apple.com/documentation/vision/recognizing-text-in-images)
- [Analyzing Image Similarity with Feature Print](https://developer.apple.com/documentation/vision/analyzing-image-similarity-with-feature-print)
- [Aligning Similar Images](https://developer.apple.com/documentation/vision/aligning-similar-images)

### 2.2 VisionKit

适合承担：

- 系统文档相机；
- Live Text 文字选择与复制；
- 相机实时识别文字和二维码；
- URL、电话、邮箱、地址、日期、快递单号等数据识别；
- iOS 17 及以上的主体提取和背景移除。

在本产品中的应用：扫描成文档、现场扫码、隐私信息发现、截图内容交互、证件照快速抠图。

参考：

- [Apple VisionKit](https://developer.apple.com/documentation/visionkit)
- [DataScannerViewController](https://developer.apple.com/documentation/visionkit/datascannerviewcontroller)
- [Scanning Data with the Camera](https://developer.apple.com/documentation/visionkit/scanning-data-with-the-camera)

### 2.3 Core Image

适合承担：

- 高斯模糊、像素化、锐化和降噪；
- 颜色、曝光、饱和度和对比度调整；
- 透视矫正、拉直、旋转和裁剪；
- Lanczos、双三次和边缘保持缩放；
- 蒙版合成与局部效果。

在本产品中的应用：马赛克、模糊、扫描增强、图片校正、证件照换底、导出前渲染。

参考：[Core Image Geometry Adjustment Filters](https://developer.apple.com/documentation/coreimage/geometry-adjustment-filters)

### 2.4 Accelerate / vImage

适合承担：

- 超长图片的大尺寸缩放；
- 卷积、形态学处理和几何变换；
- 直方图、对比度增强和色彩转换；
- Alpha 合成与像素格式转换；
- CPU 向量化处理。

它更适合后台批处理和超长图，避免为了简单像素运算反复进入 OpenCV 或 GPU。

参考：[Apple vImage](https://developer.apple.com/documentation/accelerate/vimage-library)

### 2.5 Metal / Metal Performance Shaders

适合承担：

- 编辑器实时模糊、马赛克、锐化和边缘检测；
- Sobel、Laplacian、卷积、直方图和形态学操作；
- 局部选区实时预览；
- 大图分块处理；
- 自定义 Core Image 无法满足的 GPU 效果。

不需要一开始就编写大量自定义 Metal Shader。优先使用 Core Image 和 MPS，性能证明确实不足后再下沉。

参考：[Metal Performance Shaders Image Filters](https://developer.apple.com/documentation/metalperformanceshaders/image-filters)

### 2.6 Core ML 与 Create ML

Core ML 用于运行自定义模型，并由系统选择 CPU、GPU 或 Neural Engine。Create ML 用于训练产品自有的小模型。

最值得自训练的是“截图场景分类器”，建议类别：

- 聊天记录；
- 网页文章；
- 订单物流；
- 会议课件；
- 代码与报错；
- 社交媒体；
- 证件票据；
- 普通照片。

场景分类结果可直接驱动首页动态任务卡，例如：

```text
发现 6 张聊天截图
建议拼成长图，并自动隐藏头像与昵称
```

自己训练的好处是模型更小、产品针对性更强，训练数据和权重授权也更可控。

参考：

- [Apple Core ML](https://developer.apple.com/documentation/coreml)
- [Create ML Image Classifier](https://developer.apple.com/documentation/createml/mlimageclassifier)
- [Reducing the Size of Your Core ML App](https://developer.apple.com/documentation/coreml/reducing-the-size-of-your-core-ml-app)

### 2.7 Translation

推荐流程：

```text
Vision OCR 保留文字坐标
→ Translation 本地翻译
→ 根据原文字块覆盖并重新排版
```

可以提供：仅提取文字、中英对照、覆盖原文、整张长截图翻译。整张长图翻译和批量翻译适合作为 VIP 能力。

参考：[TranslationSession](https://developer.apple.com/documentation/translation/translationsession)

### 2.8 Foundation Models

> 产品决策：暂不进入当前版本设计与开发范围，待基础图像处理体验稳定后再评估 Apple 智能版。

Foundation Models 适合处理 OCR 后的文字，不负责像素级图像处理。可应用于：

- 生成项目标题和文件名；
- 总结长截图；
- 提取时间、人物、事项和订单信息；
- 生成会议纪要；
- 将截图整理成 Bug 报告；
- 为历史项目生成标签。

该能力只在支持 Apple Intelligence 且模型可用的设备上启用，不能成为所有设备的必需链路；其他设备需要有规则和传统文本处理降级方案。

参考：[Foundation Models](https://developer.apple.com/documentation/foundationmodels/generating-content-and-performing-tasks-with-foundation-models)

## 3. OpenCV 在产品中的定位

OpenCV 主要负责确定性图像算法，而不是承担全部图片处理：

- ORB、AKAZE 或特征点匹配；
- 长截图重叠区域计算；
- 单应性矩阵和图像配准；
- 去重区域与拼接接缝计算；
- 轮廓、直线、矩形和边缘检测；
- 形态学膨胀、腐蚀、开闭运算；
- `absdiff`、结构相似度等图片差异分析；
- 小范围瑕疵的传统 Inpaint；
- OCR、分割结果的掩膜修正。

推荐分工：

```text
Vision 找到“是什么、在哪里”
OpenCV 计算“如何对齐、如何形成可靠选区”
Core Image / MPS 完成“如何实时显示与导出”
```

## 4. 功能模块优化方案

### 4.1 智能长截图

技术组合：

```text
Feature Print / OCR 文本连续性预分组
→ OpenCV 特征匹配与垂直位移计算
→ 重叠内容去重
→ 接缝质量评分
→ vImage 分块合成和导出
```

产品表现：

- 自动发现连续截图；
- 识别聊天、网页、订单等类型；
- 自动排序；
- 去除状态栏、底部输入框等重复区域；
- 接缝异常时只让用户拖动一次修正；
- 提供“已识别 6 张，预计生成 8,420 px”的明确结果。

### 4.2 智能隐私打码 2.0

技术组合：

```text
Vision OCR + 人脸 + 条码检测
→ Data Detector + 本地规则识别敏感内容
→ OpenCV 扩展和合并遮挡区域
→ Core Image / MPS 生成模糊或马赛克
```

可识别：

- 头像和昵称；
- 手机号、邮箱、地址；
- 身份证号和银行卡号；
- 订单号、快递单号；
- 二维码和条码；
- 用户自定义关键词。

关键交互：用户点选一个昵称后，可选择“隐藏本页同名内容”或“隐藏整个项目中的同名内容”。导出前执行一次隐私复检。

### 4.3 截图翻译

功能层级：

- OCR 后复制译文；
- 原文与译文对照；
- 译文覆盖原图；
- 长截图整页翻译；
- 批量翻译并导出。

需要保留每个 OCR 文字块的坐标、字体方向、颜色和背景信息，不能只返回一段纯文本。

### 4.4 相似截图清理

技术组合：

```text
感知哈希快速过滤
→ Vision Feature Print 视觉相似度
→ OCR 文本相似度
→ 清晰度、分辨率和时间信息排序
```

产品能力：

- 找出完全重复截图；
- 找出同一页面的相似截图；
- 识别可拼接的连续截图；
- 自动推荐保留最清晰的一张；
- 把同一聊天、文章或订单整理成一个项目。

### 4.5 扫描成文档

技术组合：VisionKit 文档相机、Core Image 透视矫正、vImage 增强、Vision OCR、PDFKit 导出。

产品能力：

- 自动裁边和拉直；
- 去阴影、增强文字；
- 多页 PDF；
- 可搜索 PDF；
- 票据、名片、合同和课件模式；
- OCR 后自动命名。

### 4.6 图片对比与找不同

技术组合：Vision/OpenCV 配准、亮度归一化、像素差异和结构差异分析。

适合场景：

- UI 改版前后对比；
- Bug 修复前后对比；
- 合同、表格和文档版本对比；
- 商品详情、数据报表变化对比。

结果应显示具体变化区域，而不是只显示相似度百分比。

### 4.7 证件照与主体抠图

优先使用 Vision/VisionKit 主体提取。只有发丝边缘、旧系统兼容性或特定证件照质量不够时，再引入 MODNet。

可提供：

- 自动构图；
- 人像抠图；
- 白、蓝、红底切换；
- 阴影和边缘修正；
- 常用证件尺寸；
- 证件照排版打印。

### 4.8 智能整理与报告

OCR 后结合规则或 Foundation Models：

- 会议截图生成纪要；
- Bug 截图生成复现报告；
- 订单截图整理成消费记录；
- 教程截图整理成步骤卡；
- 自动生成项目标题、标签和搜索关键词。

## 5. GitHub 本地模型候选

### 5.1 推荐进入技术验证

#### MODNet

- 仓库：[ZHKKKe/MODNet](https://github.com/ZHKKKe/MODNet)
- 用途：人像抠图、证件照、发丝边缘优化；
- 优点：针对人像、实时方向、支持 ONNX 社区部署路径；
- 授权：仓库明确说明代码、模型和 Demo 为 Apache 2.0；
- 建议：作为 Vision 主体提取的兼容或质量补充，不要重复常驻运行。

#### U-2-Net / U2NetP

- 仓库：[xuebinqin/U-2-Net](https://github.com/xuebinqin/U-2-Net)
- 用途：通用显著主体分割；
- 优点：`u2netp` 预训练模型约 4.7 MB；
- 授权：Apache 2.0；
- 局限：边缘质量通常不如专门的人像 Matting 模型；
- 建议：低包体通用分割备用方案。

#### Real-ESRGAN

- 仓库：[xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)
- 用途：低清图片修复、放大、压缩痕迹处理；
- 优点：支持 Tile 分块、FP16 和多种倍率；
- 授权：仓库为 BSD-3-Clause；
- 风险：可能重绘细小文字，不能把结果宣传为“还原原始文字”；
- 建议：做成按需下载的 VIP 高清模型，处理前显示对比预览。

#### PaddleOCR

- 仓库：[PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- 用途：Vision OCR 的第二识别引擎、复杂中文字体和特殊文档；
- 优点：有 PP-OCR 移动端模型和较完整的检测、方向、识别流程；
- 授权：Apache 2.0；
- 建议：先以真实截图测试 Vision 的失败率，达到明确阈值后再集成，避免维护两套 OCR。

#### MobileSAM

- 仓库：[ChaoningZhang/MobileSAM](https://github.com/ChaoningZhang/MobileSAM)
- 用途：点击、框选或涂抹后分割任意物体；
- 优点：支持 ONNX 导出，Apache 2.0；
- 局限：与新版 Vision 的交互式分割和主体提取存在重叠；
- 建议：用于后期“智能橡皮擦”和复杂手动选区，不进入第一版。

### 5.2 只适合研究验证，不可直接用于商业产品

#### Apple MobileCLIP

- 仓库：[apple/ml-mobileclip](https://github.com/apple/ml-mobileclip)
- 能力：图片与文字语义向量、零样本分类、语义搜索；
- 情况：代码为 MIT，但官方模型权重使用 Apple ML Research Model License；
- 限制：权重仅允许研究用途，不允许商业产品开发或使用；
- 结论：可用于研究交互效果，不可把官方权重装入正式 App。

模型许可：[MobileCLIP LICENSE_MODELS](https://github.com/apple/ml-mobileclip/blob/main/LICENSE_MODELS)

#### Apple FastVLM

- 仓库：[apple/ml-fastvlm](https://github.com/apple/ml-fastvlm)
- 能力：本地视觉语言理解，官方提供 Apple 设备演示；
- 情况：模型从 0.5B 起，仍明显重于截图分类器；
- 限制：官方模型权重同样限定研究用途，不允许用于商业产品或服务；
- 结论：不作为现阶段产品依赖。

模型许可：[FastVLM LICENSE_MODEL](https://github.com/apple/ml-fastvlm/blob/main/LICENSE_MODEL)

## 6. 推理框架选择

### 第一选择：Core ML

适用于苹果平台单独开发，系统可以利用 CPU、GPU 和 Neural Engine。能成功转换并达到精度要求的模型统一走 Core ML。

### 第二选择：ONNX Runtime Mobile

适用于：

- ONNX 模型无法完整转换成 Core ML；
- iOS 与 Android 需要共享模型和预后处理；
- 需要 Core ML Execution Provider 或 XNNPACK 回退。

参考：[ONNX Runtime Mobile](https://onnxruntime.ai/docs/tutorials/mobile/)

### 第三选择：ncnn

仓库：[Tencent/ncnn](https://github.com/Tencent/ncnn)

适用于已有 ncnn 模型、需要 C++ 跨平台统一实现或特殊算子优化的场景。它针对移动端优化，支持 ARM、FP16、INT8 和 iOS 构建。

### 暂不建议并行集成多个 Runtime

不要同时集成 Core ML、ONNX Runtime、ncnn 和 MNN。除非模型转换或跨平台需求被真实验证，否则只会增加：

- 安装包体；
- 启动和内存压力；
- 算子兼容问题；
- 崩溃排查成本；
- 第三方许可证维护成本。

## 7. 产品与付费分层建议

### 免费能力

- 基础长截图；
- 基础 OCR；
- 单张图片隐私打码；
- 重复截图扫描与少量清理；
- 文档裁边和基础矫正；
- 基础二维码识别；
- 基础标注和导出。

### VIP 高付费意愿能力

- 批量隐私识别和全项目同名遮挡；
- 导出前隐私复检；
- 整张长截图翻译和批量翻译；
- Real-ESRGAN 高清修复；
- MODNet 高质量人像抠图和证件照；
- 批量 OCR、可搜索 PDF 和多格式导出；
- 超长图高清、无水印导出；
- 批量截图整理、总结和报告生成。

### 不适合主打付费的能力

- 单纯旋转和裁剪；
- 普通滤镜；
- 基础二维码生成；
- 只有图标和名称的模板；
- 没有真实结果预览的“AI 工具”入口。

## 8. 推荐实施优先级

### P0：不增加第三方模型

- 智能隐私识别；
- Feature Print 相似截图清理；
- 连续截图自动发现；
- 截图翻译；
- VisionKit 扫描成 PDF；
- 图片配准、对比与找不同；
- OCR 索引和历史项目搜索。

### P1：增加一个自有小模型

使用 Create ML 和自有截图数据训练场景分类器，以驱动首页动态任务卡、工具推荐和自动整理。

### P2：VIP 按需下载模型

- Real-ESRGAN：高清修复；
- MODNet：高质量人像抠图；
- 必要时引入 PaddleOCR 第二识别引擎。

### P3：实验功能

- Foundation Models 截图总结、自动命名与任务建议；
- MobileSAM 智能选区；
- 生成式图片擦除；
- 本地 VLM 截图理解；
- 复杂多模态问答。

P3 必须先验证包体、峰值内存、耗时、耗电和商用授权，不能因为演示效果好就进入基础包。

## 9. 性能与包体原则

- 基础安装包不内置多个大权重；
- VIP 模型使用按需下载和后台编译；
- 优先 FP16，根据精度测试再考虑 INT8；
- 超长图、超分辨率和批处理必须 Tile 分块；
- 避免同一超长图同时存在多份 `UIImage`、`CGImage`、`CIImage` 和 OpenCV Mat；
- OCR、相似度和场景分类生成可缓存的项目级元数据；
- 编辑器预览使用低分辨率代理图，最终导出再处理原图；
- 在 A13、A15、A17 系列和不同内存规格 iPad 上分别测试；
- 新系统 API 必须做可用性判断和功能降级。

## 10. 授权检查清单

正式发布前需要分别核对：

1. 仓库源代码许可证；
2. 预训练模型权重许可证；
3. 训练数据许可证；
4. 转换后 Core ML/ONNX 权重是否仍受原许可约束；
5. NOTICE、署名和开源声明要求；
6. 模型输出是否涉及肖像、隐私或误导性修复。

“代码开源”不代表“模型权重可以商用”。MobileCLIP 和 FastVLM 就是典型例子。本文的许可证判断用于产品初筛，正式上线仍需要法务复核。

## 11. 对当前设计图的直接影响

设计图不应把技术名直接展示给普通用户，而应展示用户结果：

```text
不要：OpenCV 智能处理
改为：已找到 6 张连续截图，可自动拼接

不要：Vision OCR
改为：识别文字并保留原有段落

不要：AI 图片修复
改为：让模糊小字更清楚

不要：Feature Print 清理
改为：发现 23 张相似截图，建议保留 8 张
```

首页最多保留四个高频推荐任务；完整能力放入工具页。工具卡必须显示识别区域、拼接结果、翻译前后或修复前后等小型结果预览，而不是只展示图标和一句说明。
