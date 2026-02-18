import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import os
import sys
from model import create_model

# Constants
BATCH_SIZE = 32 # Reduced batch size for larger images
EPOCHS = 10     # Fewer epochs needed for transfer learning
IMG_SIZE = (224, 224) # MobileNetV2 default
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def train_model(train_dir='data/train', val_dir='data/test', model_save_path='model.keras'):
    """
    Trains the MobileNetV2 model using Transfer Learning.
    """
    
    # 1. Strict Data Validation
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        print(f"ERROR: Data directories not found.")
        print("Please ensure 'convert_csv.py' has been run successfully.")
        sys.exit(1)
        
    # Check for empty directories
    train_count = sum([len(files) for r, d, files in os.walk(train_dir)])
    if train_count == 0:
        print(f"ERROR: No images found in {train_dir}.")
        sys.exit(1)

    # 2. Data Generators
    # Note: We use preprocess_input from MobileNetV2 which handles normalization (-1 to 1)
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=20,
        zoom_range=0.15,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    val_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input
    )

    print("Loading data from disk and rescaling to 224x224 RGB...")
    # flow_from_directory will resize images and convert to RGB
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        color_mode='rgb', # MobileNetV2 expects 3 channels
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=True
    )

    validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=IMG_SIZE,
        color_mode='rgb',
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )

    # 3. Model Creation
    num_classes = train_generator.num_classes
    print(f"Detected {num_classes} classes.")
    
    model = create_model(num_classes=num_classes)
    
    # 4. Callbacks
    checkpoint = ModelCheckpoint(model_save_path, monitor='val_accuracy', save_best_only=True, verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=3, verbose=1, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, verbose=1, min_lr=0.00001)

    print(f"Starting Transfer Learning for {EPOCHS} epochs...")

    history = None
    # 5. Training
    try:
        history = model.fit(
            train_generator,
            steps_per_epoch=train_generator.samples // BATCH_SIZE,
            epochs=EPOCHS,
            validation_data=validation_generator,
            validation_steps=validation_generator.samples // BATCH_SIZE,
            callbacks=[checkpoint, early_stop, reduce_lr]
        )
        
        # Explicit save
        model.save(model_save_path)
        print(f"Model saved to {model_save_path}")
        
    except KeyboardInterrupt:
        print("\nTraining interrupted by user. Saving current model state...")
        model.save(model_save_path)
        print(f"Model saved to {model_save_path}")
    except Exception as e:
        print(f"Error during training: {e}")
        # Try to save anyway
        try:
            model.save(model_save_path)
        except:
            pass

    return history

if __name__ == "__main__":
    train_model()
