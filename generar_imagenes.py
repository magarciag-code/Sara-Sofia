#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar imágenes para el aplicativo de Sara Sofia
Requiere: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Crear carpeta de imágenes si no existe
images_folder = os.path.dirname(os.path.abspath(__file__))

def crear_imagen_bienvenida():
    """Crear imagen de bienvenida"""
    img = Image.new('RGB', (800, 600), color='#87CEEB')
    draw = ImageDraw.Draw(img)
    
    # Gradiente de fondo (simulado con rectángulos)
    for i in range(300):
        color = (135 + i//6, 206 - i//6, 235 - i//6)
        draw.line([(0, i), (800, i)], fill=color)
    
    # Texto
    try:
        font_grande = ImageFont.truetype("arial.ttf", 60)
        font_mediano = ImageFont.truetype("arial.ttf", 40)
    except:
        font_grande = ImageFont.load_default()
        font_mediano = ImageFont.load_default()
    
    draw.text((400, 80), "¡Bienvenida Sara Sofia!", fill='#FF69B4', font=font_grande, anchor="mm")
    draw.text((400, 300), "Al Mundo Mágico", fill='#FFD700', font=font_mediano, anchor="mm")
    draw.text((400, 400), "de la Aventura y la Diversión", fill='#FFFFFF', font=font_mediano, anchor="mm")
    
    # Sol
    draw.ellipse([(700, 50), (800, 150)], fill='#FFD700')
    
    # Tierra
    draw.rectangle([(0, 400), (800, 600)], fill='#90EE90')
    
    # Árbol simple
    draw.rectangle([(150, 350), (200, 450)], fill='#8B4513')
    draw.ellipse([(100, 300), (250, 350)], fill='#228B22')
    
    img.save(os.path.join(images_folder, 'welcome.png'))
    print("✓ welcome.png generado")

def crear_imagen_aventura():
    """Crear imagen de aventura"""
    img = Image.new('RGB', (800, 600), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Gradiente vertical
    for i in range(600):
        r = int(102 + (118-102) * i / 600)
        g = int(126 + (154-126) * i / 600)
        b = int(234 + (162-234) * i / 600)
        draw.line([(0, i), (800, i)], fill=(r, g, b))
    
    try:
        font = ImageFont.truetype("arial.ttf", 70)
    except:
        font = ImageFont.load_default()
    
    draw.text((400, 100), "LA AVENTURA", fill='#FFFFFF', font=font, anchor="mm")
    draw.text((400, 200), "de Sara Sofia", fill='#FFD700', font=font, anchor="mm")
    
    # Montañas
    points = [(0, 350), (150, 200), (300, 350)]
    draw.polygon(points, fill='#8B7355')
    
    points = [(300, 350), (500, 150), (700, 350)]
    draw.polygon(points, fill='#8B7355')
    
    # Sol
    draw.ellipse([(650, 20), (750, 120)], fill='#FFD700')
    
    img.save(os.path.join(images_folder, 'adventure.png'))
    print("✓ adventure.png generado")

def crear_imagen_portal():
    """Crear imagen del portal mágico"""
    img = Image.new('RGB', (800, 600), color='#1a0033')
    draw = ImageDraw.Draw(img)
    
    # Fondo oscuro
    draw.rectangle([(0, 0), (800, 600)], fill='#1a0033')
    
    try:
        font = ImageFont.truetype("arial.ttf", 50)
    except:
        font = ImageFont.load_default()
    
    # Portal circular
    draw.ellipse([(250, 200), (550, 400)], outline='#00FF00', width=10)
    draw.ellipse([(260, 210), (540, 390)], outline='#FF00FF', width=5)
    
    # Efecto de luz
    for i in range(1, 5):
        draw.ellipse(
            [(250 + i*10, 200 + i*10), (550 - i*10, 400 - i*10)],
            outline='#00FFFF',
            width=1
        )
    
    draw.text((400, 500), "✨ Portal Mágico ✨", fill='#00FF00', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'portal.png'))
    print("✓ portal.png generado")

def crear_imagen_reino_encantado():
    """Crear imagen del reino encantado"""
    img = Image.new('RGB', (800, 600), color='#87CEEB')
    draw = ImageDraw.Draw(img)
    
    # Cielo
    for i in range(300):
        color_val = int(135 + (206 - 135) * i / 300)
        draw.line([(0, i), (800, i)], fill=(135, color_val, 235))
    
    # Tierra
    draw.rectangle([(0, 350), (800, 600)], fill='#90EE90')
    
    try:
        font = ImageFont.truetype("arial.ttf", 50)
    except:
        font = ImageFont.load_default()
    
    # Árboles
    draw.rectangle([(100, 300), (150, 400)], fill='#8B4513')
    draw.ellipse([(50, 250), (200, 320)], fill='#228B22')
    
    draw.rectangle([(650, 280), (700, 400)], fill='#8B4513')
    draw.ellipse([(600, 220), (750, 310)], fill='#228B22')
    
    # Flores
    for x in [200, 350, 550]:
        for y in [380, 420]:
            draw.ellipse([(x-15, y-15), (x+15, y+15)], fill='#FF1493')
    
    draw.text((400, 100), "🏰 Reino Encantado 🏰", fill='#FFD700', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'enchanted-kingdom.png'))
    print("✓ enchanted-kingdom.png generado")

def crear_imagen_tesoro():
    """Crear imagen del tesoro"""
    img = Image.new('RGB', (800, 600), color='#8B4513')
    draw = ImageDraw.Draw(img)
    
    # Arena
    draw.rectangle([(100, 250), (700, 450)], fill='#D2B48C')
    
    # Baúl
    draw.rectangle([(200, 250), (600, 350)], fill='#8B4513', outline='#000000', width=3)
    draw.arc([(200, 200), (600, 250)], 0, 180, fill='#FFD700', width=8)
    
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    draw.text((400, 100), "💎 TESORO 💎", fill='#FFD700', font=font, anchor="mm")
    
    # Monedas
    for i in range(15):
        x = 250 + (i % 5) * 80
        y = 280 + (i // 5) * 60
        draw.ellipse([(x-15, y-15), (x+15, y+15)], fill='#FFD700', outline='#FF8C00', width=2)
    
    # Joyas
    for i in range(8):
        x = 300 + (i % 4) * 80
        y = 320 + (i // 4) * 40
        draw.ellipse([(x-8, y-8), (x+8, y+8)], fill='#FF1493')
    
    img.save(os.path.join(images_folder, 'treasure.png'))
    print("✓ treasure.png generado")

def crear_imagen_regreso_casa():
    """Crear imagen de regreso a casa"""
    img = Image.new('RGB', (800, 600), color='#87CEEB')
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arial.ttf", 50)
    except:
        font = ImageFont.load_default()
    
    # Casa
    draw.rectangle([(250, 250), (550, 400)], fill='#D2691E', outline='#000000', width=3)
    
    # Techo
    draw.polygon([(250, 250), (400, 150), (550, 250)], fill='#8B4513', outline='#000000')
    
    # Puerta
    draw.rectangle([(360, 350), (440, 450)], fill='#654321', outline='#000000', width=2)
    draw.ellipse([(425, 390), (435, 400)], fill='#FFD700')
    
    # Ventanas
    draw.rectangle([(280, 280), (330, 330)], fill='#87CEEB', outline='#000000', width=2)
    draw.rectangle([(470, 280), (520, 330)], fill='#87CEEB', outline='#000000', width=2)
    
    # Líneas de ventanas
    draw.line([(305, 280), (305, 330)], fill='#000000', width=1)
    draw.line([(280, 305), (330, 305)], fill='#000000', width=1)
    draw.line([(495, 280), (495, 330)], fill='#000000', width=1)
    draw.line([(470, 305), (520, 305)], fill='#000000', width=1)
    
    draw.text((400, 80), "🏠 Dulce Hogar 🏠", fill='#FF69B4', font=font, anchor="mm")
    draw.text((400, 520), "¡Bienvenida a Casa!", fill='#228B22', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'home-return.png'))
    print("✓ home-return.png generado")

def crear_imagen_paint_game():
    """Crear imagen del juego de pintar"""
    img = Image.new('RGB', (800, 600), color='#FFE4E1')
    draw = ImageDraw.Draw(img)
    
    try:
        font_grande = ImageFont.truetype("arial.ttf", 80)
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font_grande = font = ImageFont.load_default()
    
    # Icono de pincel
    draw.rectangle([(200, 250), (230, 350)], fill='#8B4513', outline='#000000', width=2)
    draw.rectangle([(190, 200), (240, 250)], fill='#FF0000', outline='#000000', width=2)
    
    # Paleta de colores
    draw.ellipse([(550, 240), (700, 360)], fill='#FFE4B5', outline='#000000', width=2)
    
    # Colores
    colors = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00']
    positions = [(600, 270), (660, 270), (600, 330), (660, 330)]
    
    for color, pos in zip(colors, positions):
        draw.ellipse([(pos[0]-20, pos[1]-20), (pos[0]+20, pos[1]+20)], fill=color, outline='#000000', width=2)
    
    draw.text((400, 450), "🎨 Pintar y Dibujar 🎨", fill='#FF69B4', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'paint-game.png'))
    print("✓ paint-game.png generado")

def crear_imagen_coloring_game():
    """Crear imagen del juego de colorear"""
    img = Image.new('RGB', (800, 600), color='#FFE4E1')
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # León
    draw.ellipse([(200, 200), (340, 340)], fill='#FF8C00', outline='#000000', width=2)
    draw.ellipse([(160, 200), (280, 320)], fill='#FFA500', outline='#000000', width=2)
    draw.ellipse([(280, 200), (400, 320)], fill='#FFA500', outline='#000000', width=2)
    draw.ellipse([(270, 250), (290, 270)], fill='#000000')
    draw.ellipse([(310, 250), (330, 270)], fill='#000000')
    
    # Elefante
    draw.ellipse([(550, 220), (650, 320)], fill='#C0C0C0', outline='#000000', width=2)
    draw.ellipse([(560, 150), (640, 230)], fill='#C0C0C0', outline='#000000', width=2)
    draw.ellipse([(500, 200), (560, 320)], fill='#808080', outline='#000000', width=2)
    
    draw.text((400, 450), "🦁 Colorear Animales 🦁", fill='#FF69B4', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'coloring-game.png'))
    print("✓ coloring-game.png generado")

def crear_imagen_maze_game():
    """Crear imagen del juego del laberinto"""
    img = Image.new('RGB', (800, 600), color='#FFE4E1')
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # Marco del laberinto
    draw.rectangle([(100, 100), (700, 400)], outline='#333333', width=3)
    
    # Líneas del laberinto
    draw.line([(250, 100), (250, 250)], fill='#333333', width=3)
    draw.line([(100, 200), (400, 200)], fill='#333333', width=3)
    draw.line([(500, 100), (500, 300)], fill='#333333', width=3)
    draw.line([(150, 300), (600, 300)], fill='#333333', width=3)
    
    # Entrada (círculo rosa)
    draw.ellipse([(105, 135), (135, 165)], fill='#FF69B4')
    
    # Salida (cuadrado dorado)
    draw.rectangle([(685, 385), (715, 415)], fill='#FFD700')
    
    draw.text((400, 480), "🌀 Juego del Laberinto 🌀", fill='#FF69B4', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'maze-game.png'))
    print("✓ maze-game.png generado")

def crear_imagen_quiz_game():
    """Crear imagen del juego de preguntas"""
    img = Image.new('RGB', (800, 600), color='#FFE4E1')
    draw = ImageDraw.Draw(img)
    
    try:
        font_grande = ImageFont.truetype("arial.ttf", 100)
        font = ImageFont.truetype("arial.ttf", 40)
        font_pequeno = ImageFont.truetype("arial.ttf", 24)
    except:
        font_grande = font = font_pequeno = ImageFont.load_default()
    
    # Signo de interrogación
    draw.text((400, 150), "?", fill='#FF69B4', font=font_grande, anchor="mm")
    
    # Opciones
    draw.rectangle([(100, 200), (300, 280)], fill='#667eea', outline='#000000', width=2)
    draw.rectangle([(500, 200), (700, 280)], fill='#667eea', outline='#000000', width=2)
    draw.rectangle([(100, 310), (300, 390)], fill='#667eea', outline='#000000', width=2)
    draw.rectangle([(500, 310), (700, 390)], fill='#667eea', outline='#000000', width=2)
    
    # Letras
    draw.text((200, 240), "A", fill='#FFFFFF', font=font_pequeno, anchor="mm")
    draw.text((600, 240), "B", fill='#FFFFFF', font=font_pequeno, anchor="mm")
    draw.text((200, 350), "C", fill='#FFFFFF', font=font_pequeno, anchor="mm")
    draw.text((600, 350), "D", fill='#FFFFFF', font=font_pequeno, anchor="mm")
    
    draw.text((400, 500), "❓ Preguntas y Respuestas ❓", fill='#FF69B4', font=font, anchor="mm")
    
    img.save(os.path.join(images_folder, 'quiz-game.png'))
    print("✓ quiz-game.png generado")

def main():
    """Generar todas las imágenes"""
    print("Generando imágenes para Sara Sofia...")
    print()
    
    crear_imagen_bienvenida()
    crear_imagen_aventura()
    crear_imagen_portal()
    crear_imagen_reino_encantado()
    crear_imagen_tesoro()
    crear_imagen_regreso_casa()
    crear_imagen_paint_game()
    crear_imagen_coloring_game()
    crear_imagen_maze_game()
    crear_imagen_quiz_game()
    
    print()
    print("✅ ¡Todas las imágenes han sido generadas exitosamente!")
    print()

if __name__ == '__main__':
    main()
