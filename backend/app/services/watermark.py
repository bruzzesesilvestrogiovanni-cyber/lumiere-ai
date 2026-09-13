"""
Watermark Service for Trial Users
Adds "LUMIERE AI" watermark to generated content
"""

import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont


def add_watermark_to_image(image_base64: str, watermark_text: str = "LUMIERE AI") -> str:
    """
    Add watermark to base64 encoded image

    Args:
        image_base64: Base64 encoded image string
        watermark_text: Text to add as watermark

    Returns:
        Base64 encoded image with watermark
    """
    # Decode base64 image
    image_data = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_data))

    # Convert to RGBA if needed
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # Create watermark layer
    watermark_layer = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark_layer)

    # Calculate font size based on image size
    min_dimension = min(image.size)
    font_size = max(20, min_dimension // 15)

    # Try to load a font, fall back to default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Get text bounding box
    bbox = draw.textbbox((0, 0), watermark_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Position watermark in bottom-right corner with padding
    padding = 20
    x = image.size[0] - text_width - padding
    y = image.size[1] - text_height - padding

    # Draw semi-transparent watermark with shadow
    shadow_offset = 2
    draw.text((x + shadow_offset, y + shadow_offset), watermark_text,
              font=font, fill=(0, 0, 0, 100))  # Shadow
    draw.text((x, y), watermark_text,
              font=font, fill=(255, 255, 255, 180))  # Main text

    # Composite watermark onto image
    watermarked = Image.alpha_composite(image, watermark_layer)

    # Convert back to RGB for JPEG compatibility
    if watermarked.mode == 'RGBA':
        background = Image.new('RGB', watermarked.size, (255, 255, 255))
        background.paste(watermarked, mask=watermarked.split()[3])
        watermarked = background

    # Encode back to base64
    buffer = BytesIO()
    watermarked.save(buffer, format='PNG', quality=95)
    buffer.seek(0)

    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def add_diagonal_watermark(image_base64: str, watermark_text: str = "LUMIERE AI") -> str:
    """
    Add diagonal repeating watermark pattern to image
    More visible watermark for trial users

    Args:
        image_base64: Base64 encoded image string
        watermark_text: Text to add as watermark

    Returns:
        Base64 encoded image with watermark
    """
    # Decode base64 image
    image_data = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_data))

    # Convert to RGBA if needed
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # Create watermark layer
    watermark_layer = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark_layer)

    # Calculate font size based on image size
    min_dimension = min(image.size)
    font_size = max(24, min_dimension // 12)

    # Try to load a font
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Get text dimensions
    bbox = draw.textbbox((0, 0), watermark_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Draw diagonal pattern
    spacing_x = text_width + 100
    spacing_y = text_height + 80

    # Create rotated text pattern
    for y_offset in range(-image.size[1], image.size[1] * 2, spacing_y):
        for x_offset in range(-image.size[0], image.size[0] * 2, spacing_x):
            # Offset every other row
            actual_x = x_offset + (y_offset // spacing_y % 2) * (spacing_x // 2)

            # Draw with transparency
            draw.text((actual_x, y_offset), watermark_text,
                      font=font, fill=(255, 255, 255, 50))

    # Composite watermark onto image
    watermarked = Image.alpha_composite(image, watermark_layer)

    # Convert back to RGB
    if watermarked.mode == 'RGBA':
        background = Image.new('RGB', watermarked.size, (255, 255, 255))
        background.paste(watermarked, mask=watermarked.split()[3])
        watermarked = background

    # Encode back to base64
    buffer = BytesIO()
    watermarked.save(buffer, format='PNG', quality=95)
    buffer.seek(0)

    return base64.b64encode(buffer.getvalue()).decode('utf-8')


# Singleton function for easy use
def apply_watermark(image_base64: str, style: str = "corner") -> str:
    """
    Apply watermark to image

    Args:
        image_base64: Base64 encoded image
        style: "corner" for bottom-right, "diagonal" for pattern

    Returns:
        Base64 encoded watermarked image
    """
    if style == "diagonal":
        return add_diagonal_watermark(image_base64)
    return add_watermark_to_image(image_base64)
